"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function EmailTestPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{type: string, success: boolean, message: string}[]>([])

  const testNewsletter = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      
      setResults(prev => [...prev, {
        type: "Newsletter",
        success: response.ok,
        message: response.ok ? "Newsletter email sent successfully!" : data.error
      }])
    } catch {
      setResults(prev => [...prev, {
        type: "Newsletter",
        success: false,
        message: "Network error"
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const testSignup = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name || "Test User", 
          email, 
          password: "testpassword123" 
        }),
      })
      const data = await response.json()
      
      setResults(prev => [...prev, {
        type: "Welcome Email",
        success: response.ok,
        message: response.ok ? "Welcome email sent successfully!" : data.error
      }])
    } catch {
      setResults(prev => [...prev, {
        type: "Welcome Email",
        success: false,
        message: "Network error"
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const testContact = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name || "Test Contact", 
          email, 
          subject: subject || "Test Subject",
          message: message || "Test message"
        }),
      })
      const data = await response.json()
      
      setResults(prev => [...prev, {
        type: "Contact Form",
        success: response.ok,
        message: response.ok ? "Contact email sent successfully!" : data.error
      }])
    } catch {
      setResults(prev => [...prev, {
        type: "Contact Form",
        success: false,
        message: "Network error"
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            📧 Email Testing Dashboard
          </h1>
          <p className="text-blue-200 text-lg">
            Test all email functionality for Agent to Environment
          </p>
          <div className="mt-4 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <p className="text-blue-100 text-sm">
              <strong>Note:</strong> In development mode, all emails are sent to your verified email address (vashuag9@gmail.com) 
              with the original recipient shown in the subject line.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Forms */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Test Forms
                </CardTitle>
                <CardDescription>
                  Fill in the details and test different email types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Name (Optional)</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject (Optional)</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={testNewsletter} 
                    disabled={!email || isLoading}
                    className="w-full"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Test Newsletter Email
                  </Button>
                  
                  <Button 
                    onClick={testSignup} 
                    disabled={!email || isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Test Welcome Email
                  </Button>
                  
                  <Button 
                    onClick={testContact} 
                    disabled={!email || isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Test Contact Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Test Results</CardTitle>
                  <Button onClick={clearResults} variant="outline" size="sm">
                    Clear Results
                  </Button>
                </div>
                <CardDescription>
                  Results from your email tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No tests run yet. Use the forms on the left to test emails.
                    </p>
                  ) : (
                    results.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border ${
                          result.success 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                      >
                        <div className="flex items-start">
                          {result.success ? (
                            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium">{result.type}</p>
                            <p className="text-sm">{result.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
