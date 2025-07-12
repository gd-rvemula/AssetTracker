#!/usr/bin/env python3
"""
GitHub Action script to check for expiring licenses and create notifications.
This script should be run daily via GitHub Actions.
"""

import yaml
import datetime
import os
import requests
from typing import List, Dict

def load_licenses(file_path: str) -> List[Dict]:
    """Load licenses from YAML file."""
    with open(file_path, 'r') as file:
        data = yaml.safe_load(file)
        return data.get('licenses', [])

def check_expiring_licenses(licenses: List[Dict], days_threshold: int = 30) -> List[Dict]:
    """Check for licenses expiring within the 30 days threshold."""
    today = datetime.date.today()
    threshold_date = today + datetime.timedelta(days=days_threshold)
    
    expiring_licenses = []
    
    for license in licenses:
        expiry_date = datetime.datetime.strptime(license['expiryDate'], '%Y-%m-%d').date()
        
        if today <= expiry_date <= threshold_date:
            days_until_expiry = (expiry_date - today).days
            license['daysUntilExpiry'] = days_until_expiry
            expiring_licenses.append(license)
    
    return expiring_licenses

def create_github_issue(expiring_licenses: List[Dict], repo_owner: str, repo_name: str, token: str):
    """Create a GitHub issue for expiring licenses."""
    if not expiring_licenses:
        return
    
    # Create issue title and body
    title = f"License Expiration Alert - {len(expiring_licenses)} license(s) expiring soon"
    
    body = "## 🚨 License Expiration Alert\n\n"
    body += f"The following {len(expiring_licenses)} license(s) are expiring within the next 30 days:\n\n"
    
    for license in expiring_licenses:
        body += f"### {license['productName']}\n"
        body += f"- **Vendor:** {license['vendor']}\n"
        body += f"- **Department:** {license.get('department', 'N/A')}\n"
        body += f"- **Expiry Date:** {license['expiryDate']}\n"
        body += f"- **Days Until Expiry:** {license['daysUntilExpiry']}\n"
        body += f"- **Notes:** {license.get('notes', 'N/A')}\n\n"
    
    body += "## Action Required\n"
    body += "Please review these licenses and take appropriate action:\n"
    body += "1. Contact the vendor for renewal\n"
    body += "2. Update the license information in the repository\n"
    body += "3. Notify the relevant departments\n\n"
    body += "---\n"
    body += "*This issue was automatically created by the License Tracker system.*"
    
    # Create the issue
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues"
    headers = {
        'Authorization': f'token {token}',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    data = {
        'title': title,
        'body': body,
        'labels': ['license-expiration', 'alert']
    }
    
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 201:
        print(f"Successfully created GitHub issue: {response.json()['html_url']}")
    else:
        print(f"Failed to create GitHub issue: {response.status_code} - {response.text}")

def main():
    """Main function to check licenses and create notifications."""
    # Get environment variables
    repo_owner = os.getenv('GITHUB_REPOSITORY_OWNER')
    repo_name = os.getenv('GITHUB_REPOSITORY', '').split('/')[-1]
    github_token = os.getenv('GITHUB_TOKEN')
    
    if not all([repo_owner, repo_name, github_token]):
        print("Missing required environment variables")
        return
    
    try:
        # Load licenses
        licenses = load_licenses('licenses.yaml')
        print(f"Loaded {len(licenses)} licenses")
        
        # Check for expiring licenses
        expiring_licenses = check_expiring_licenses(licenses)
        print(f"Found {len(expiring_licenses)} expiring licenses")
        
        if expiring_licenses:
            # Create GitHub issue
            create_github_issue(expiring_licenses, repo_owner, repo_name, github_token)
        else:
            print("No licenses expiring soon")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
