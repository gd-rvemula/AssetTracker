export interface License {
  id: string
  productName: string
  vendor: string
  licenseKey: string
  expiryDate: string
  notes?: string
  department?: string
  category?: string
}

export const getDemoLicenses = (): License[] => {
  return [
    {
      id: "1",
      productName: "Microsoft Office 365",
      vendor: "Microsoft",
      licenseKey: "XXXXX-XXXXX-XXXXX-12345",
      expiryDate: "2025-12-31",
      notes: "Enterprise license for 500 users",
      department: "IT",
      category: "Productivity",
    },
    {
      id: "2",
      productName: "Adobe Creative Suite",
      vendor: "Adobe",
      licenseKey: "XXXXX-XXXXX-XXXXX-67890",
      expiryDate: "2024-08-15",
      notes: "Design team license",
      department: "Marketing",
      category: "Design",
    },
    {
      id: "3",
      productName: "Slack Pro",
      vendor: "Slack Technologies",
      licenseKey: "XXXXX-XXXXX-XXXXX-11111",
      expiryDate: "2024-06-30",
      notes: "Team communication platform",
      department: "IT",
      category: "Communication",
    },
    {
      id: "4",
      productName: "JetBrains IntelliJ IDEA",
      vendor: "JetBrains",
      licenseKey: "XXXXX-XXXXX-XXXXX-22222",
      expiryDate: "2025-03-15",
      notes: "Development team IDE licenses",
      department: "Engineering",
      category: "Development",
    },
  ]
} 