import React from 'react';

export default function SecurityPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Security Policy
          </h1>
          
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                🛡️ Responsible Disclosure Policy
              </h2>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  We take security seriously at CodyToken. If you discover a security vulnerability, 
                  we appreciate your help in disclosing it to us in a responsible manner.
                </p>
                
                <h3 className="text-xl font-semibold text-white mt-6 mb-4">What We Consider Security Issues</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Authentication and authorization bypasses</li>
                  <li>• Cross-site scripting (XSS)</li>
                  <li>• Cross-site request forgery (CSRF)</li>
                  <li>• SQL injection</li>
                  <li>• Remote code execution</li>
                  <li>• Information disclosure</li>
                  <li>• Denial of service vulnerabilities</li>
                  <li>• Issues with Stellar blockchain integration</li>
                  <li>• Wallet security vulnerabilities</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                📧 How to Report
              </h2>
              
              <div className="space-y-4 text-gray-300">
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-300 mb-2">⚠️ DO NOT</h4>
                  <ul className="space-y-1">
                    <li>• Open public GitHub issues for security vulnerabilities</li>
                    <li>• Discuss vulnerabilities in public channels</li>
                    <li>• Attempt to access other users&apos; accounts or data</li>
                    <li>• Perform any destructive testing</li>
                  </ul>
                </div>
                
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-green-300 mb-2">✅ DO</h4>
                  <ul className="space-y-1">
                    <li>• Email us at security@codytoken.com</li>
                    <li>• Use encrypted communication with our PGP key</li>
                    <li>• Provide clear reproduction steps</li>
                    <li>• Allow reasonable time for fixes</li>
                    <li>• Test only on your own accounts</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                ⏱️ Response Timeline
              </h2>
              
              <div className="space-y-4 text-gray-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Initial Response</h4>
                    <p>Within 24 hours</p>
                  </div>
                  
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-300 mb-2">Status Update</h4>
                    <p>Within 72 hours</p>
                  </div>
                  
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-2">Fix Timeline</h4>
                    <p>30-90 days depending on severity</p>
                  </div>
                  
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-300 mb-2">Public Disclosure</h4>
                    <p>After fix is deployed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                🏆 Recognition
              </h2>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  We believe in recognizing security researchers who help improve our security posture:
                </p>
                
                <ul className="space-y-2 ml-4">
                  <li>• Public acknowledgment on our security acknowledgments page</li>
                  <li>• Credit in security advisories (if desired)</li>
                  <li>• Invitation to our security researcher program</li>
                  <li>• Special recognition in our community</li>
                </ul>
                
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mt-4">
                  <p className="text-yellow-300">
                    <strong>Note:</strong> We do not currently offer monetary rewards, but we&apos;re 
                    considering implementing a bug bounty program in the future.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                📞 Contact Information
              </h2>
              
              <div className="space-y-4 text-gray-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Email</h4>
                    <p>security@codytoken.com</p>
                  </div>
                  
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-2">PGP Key</h4>
                    <a 
                      href="/pgp-key.txt" 
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Download Public Key
                    </a>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mt-4">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
