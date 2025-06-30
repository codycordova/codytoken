// ========== /src/app/terms/page.tsx ==========
import React from 'react';
import Footer from '../../components/Footer';
import './Terms.css';

export default function TermsPage() {
    return (
        <div className="terms-page">
            <main className="terms-container">
                <h1 className="terms-title">Terms of Service</h1>
                <div className="terms-box">
                    <p><strong>1. Introduction</strong><br />
                        CODY Token is a custom asset created on the Stellar Blockchain by Cody Cordova, a music producer, DJ, and indie developer. This token is designed for fans to support Cody Cordova&rsquo;s projects, purchase merchandise and concert tickets, or trade as they wish. Please read the following Terms of Service carefully.
                    </p>
                    <p><strong>2. Not a Security</strong><br />
                        CODY Token is not a security, investment, or financial product. It is a fun, community-based project initiated by Cody Cordova as part of an experiment in technology, finance, music, and social respect. Participation in this project is entirely voluntary and should be approached with a spirit of curiosity and enjoyment.
                    </p>
                    <p><strong>3. No Financial Advice</strong><br />
                        The information provided about CODY Token is not financial advice. Users should make their own decisions regarding the use, trading, or holding of CODY Tokens. Cody Cordova and CODY CORDOVA LLC make no guarantees regarding the value, price, or future performance of CODY Token.
                    </p>
                    <p><strong>4. No Expected Return on Investment (ROI)</strong><br />
                        CODY Token is not designed to provide any form of return on investment. While users may trade CODY Token or use it to purchase goods or services from CODY CORDOVA LLC, there are no promises or expectations of profits, gains, or financial returns.
                    </p>
                    <p><strong>5. Use of CODY Token</strong><br />
                        CODY Token can be used within the Cody Cordova community to redeem items, purchase merchandise, concert tickets, or for other interactions as specified by CODY CORDOVA LLC. Users are free to trade, swap, or sell their tokens, but they do so at their own risk and discretion.
                    </p>
                    <p><strong>6. Experimental Nature</strong><br />
                        CODY Token is part of a larger experiment conducted by Cody Cordova, exploring the intersection of technology, music, finance, and community. As such, the project may evolve, change, or discontinue at any time without prior notice.
                    </p>
                    <p><strong>7. Legal Disclaimer</strong><br />
                        By participating in the CODY Token project, users acknowledge that they do so voluntarily and with an understanding of the experimental nature of the project. CODY CORDOVA LLC is not liable for any losses, damages, or legal issues arising from the use, trade, or holding of CODY Token.
                    </p>
                    <p><strong>8. Amendments</strong><br />
                        Cody Cordova reserves the right to amend or update these Terms of Service at any time. Continued use of CODY Token implies acceptance of any revised terms.
                    </p>
                    <p><strong>9. Governing Law</strong><br />
                        These Terms of Service are governed by the laws of the State of California. Any disputes arising from these terms or the CODY Token project will be resolved in the courts of California.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}