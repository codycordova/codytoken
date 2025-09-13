import React from 'react';

export default function SecurityAcknowledgments() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Security Acknowledgments
          </h1>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Thank You to Our Security Researchers
            </h2>
            
            <p className="text-gray-300 mb-6">
              We appreciate the security research community's efforts in helping keep CodyToken secure. 
              This page recognizes individuals who have responsibly disclosed security vulnerabilities.
            </p>
            
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                🏆 Hall of Fame
              </h3>
              <p className="text-gray-300">
                No security vulnerabilities have been reported yet. Be the first to help secure CodyToken!
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Recognition Criteria</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Responsible disclosure of security vulnerabilities</li>
                <li>• Clear reproduction steps and impact assessment</li>
                <li>• Allowing reasonable time for fixes before public disclosure</li>
                <li>• Following our security policy guidelines</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              How to Report Security Issues
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <p>
                If you discover a security vulnerability, please report it responsibly:
              </p>
              
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Email</h4>
                <p>security@codytoken.com</p>
              </div>
              
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-300 mb-2">Encrypted Communication</h4>
                <p>Use our PGP key for encrypted communication</p>
                <a 
                  href="/pgp-key.txt" 
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Download PGP Key
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
