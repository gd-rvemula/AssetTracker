"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, Search, AlertTriangle, Eye, EyeOff, RefreshCw, LogOut } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { License, getDemoLicenses } from "@/data/demo-licenses"

interface User {
  login: string
  name: string
  avatar_url: string
}

export default function LicenseTracker() {
  const [user, setUser] = useState<User | null>(null)
  const [licenses, setLicenses] = useState<License[]>([])
  const [filteredLicenses, setFilteredLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<keyof License>("expiryDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterBy, setFilterBy] = useState<"all" | "expiring" | "expired">("all")
  const [showKeys, setShowKeys] = useState(false)
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null)

  // GitHub OAuth configuration
  const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "your-github-client-id"
  const REPO_OWNER = process.env.NEXT_PUBLIC_REPO_OWNER || "your-org"
  const REPO_NAME = process.env.NEXT_PUBLIC_REPO_NAME || "license-tracker"

  useEffect(() => {
    // Bypass authentication for testing - load demo data directly
    setLoading(true)
    
    // Simulate a demo user
    setUser({
      login: "demo-user",
      name: "Demo User",
      avatar_url: "https://github.com/github.png"
    })
    
    // Load demo data immediately
    setLicenses(getDemoLicenses())
    setLoading(false)
  }, [])

  useEffect(() => {
    filterAndSortLicenses()
  }, [licenses, searchTerm, sortBy, sortOrder, filterBy])

  const handleGitHubLogin = () => {
    const redirectUri = window.location.origin
    const scope = "repo read:user"
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`
    window.location.href = githubAuthUrl
  }

  const handleGitHubCallback = async (code: string) => {
    try {
      // In a real implementation, you'd need a backend service to exchange the code for a token
      // For demo purposes, we'll simulate this
      console.log("GitHub OAuth code received:", code)
      // This would typically be handled by your backend
      setError("GitHub OAuth integration requires backend service for token exchange")
    } catch (error) {
      setError("Failed to authenticate with GitHub")
      setLoading(false)
    }
  }

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        throw new Error("Failed to fetch user data")
      }
    } catch (error) {
      setError("Failed to fetch user data")
      localStorage.removeItem("github_token")
      setLoading(false)
    }
  }

  const fetchLicenseData = async () => {
    // Always use demo data for testing
    setLicenses(getDemoLicenses())
    setLoading(false)
  }

  const parseYamlLicenses = (yamlContent: string): License[] => {
    // Simplified YAML parsing - in a real app, use a proper YAML parser like js-yaml
    // This is just for demonstration
    return getDemoLicenses()
  }

  const filterAndSortLicenses = () => {
    let filtered = [...licenses]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (license) =>
          license.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          license.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          license.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          license.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply expiry filter
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    if (filterBy === "expiring") {
      filtered = filtered.filter((license) => {
        const expiryDate = new Date(license.expiryDate)
        return expiryDate <= thirtyDaysFromNow && expiryDate >= today
      })
    } else if (filterBy === "expired") {
      filtered = filtered.filter((license) => {
        const expiryDate = new Date(license.expiryDate)
        return expiryDate < today
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "expiryDate") {
        aValue = new Date(a.expiryDate).getTime()
        bValue = new Date(b.expiryDate).getTime()
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredLicenses(filtered)
  }

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) {
      return { status: "expired", variant: "destructive" as const, text: "Expired" }
    } else if (daysUntilExpiry <= 30) {
      return { status: "expiring", variant: "destructive" as const, text: `${daysUntilExpiry} days` }
    } else if (daysUntilExpiry <= 90) {
      return { status: "warning", variant: "secondary" as const, text: `${daysUntilExpiry} days` }
    } else {
      return { status: "active", variant: "default" as const, text: `${daysUntilExpiry} days` }
    }
  }

  const obfuscateLicenseKey = (key: string) => {
    if (showKeys) return key
    const parts = key.split("-")
    return parts.map((part, index) => (index === parts.length - 1 ? part : "X".repeat(part.length))).join("-")
  }

  const handleLogout = () => {
    localStorage.removeItem("github_token")
    setUser(null)
    setLicenses([])
    setFilteredLicenses([])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Authentication bypassed for testing - user is always set

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Asset Management</h1>
                <p className="text-sm text-muted-foreground">Software License Management (Demo Mode)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={user.avatar_url || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium">{user.name || user.login} (Demo)</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => fetchLicenseData()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {error && (
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Licenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{licenses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {
                  licenses.filter((l) => {
                    const days = Math.ceil(
                      (new Date(l.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )
                    return days <= 30 && days >= 0
                  }).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {licenses.filter((l) => new Date(l.expiryDate) < new Date()).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  licenses.filter((l) => {
                    const days = Math.ceil(
                      (new Date(l.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )
                    return days > 30
                  }).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle>License Inventory</CardTitle>
                <CardDescription>Manage and track software licenses across your organization</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowKeys(!showKeys)}>
                  {showKeys ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showKeys ? "Hide Keys" : "Show Keys"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search licenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Licenses</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="productName">Product Name</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="expiryDate">Expiry Date</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>License Key</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLicenses.map((license) => {
                    const expiryStatus = getExpiryStatus(license.expiryDate)
                    return (
                      <TableRow key={license.id}>
                        <TableCell className="font-medium">{license.productName}</TableCell>
                        <TableCell>{license.vendor}</TableCell>
                        <TableCell className="font-mono text-sm">{obfuscateLicenseKey(license.licenseKey)}</TableCell>
                        <TableCell>{new Date(license.expiryDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={expiryStatus.variant}>{expiryStatus.text}</Badge>
                        </TableCell>
                        <TableCell>{license.department}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedLicense(license)}>
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{license.productName}</DialogTitle>
                                <DialogDescription>License Details</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Vendor</label>
                                    <p className="text-sm text-muted-foreground">{license.vendor}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Department</label>
                                    <p className="text-sm text-muted-foreground">{license.department}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Category</label>
                                    <p className="text-sm text-muted-foreground">{license.category}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Expiry Date</label>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(license.expiryDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">License Key</label>
                                  <p className="text-sm text-muted-foreground font-mono">
                                    {showKeys ? license.licenseKey : obfuscateLicenseKey(license.licenseKey)}
                                  </p>
                                </div>
                                {license.notes && (
                                  <div>
                                    <label className="text-sm font-medium">Notes</label>
                                    <p className="text-sm text-muted-foreground">{license.notes}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredLicenses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No licenses found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
