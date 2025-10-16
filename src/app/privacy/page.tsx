import React from 'react';
import Footer from '../../components/Footer';

export default function PrivacyPage() {
    return (
        <div className="text-page">
            <main className="main-content">
                <h1 className="privacy-title">Privacy Policy</h1>
                <div className="privacy-content">
                    
                    <section className="privacy-section">
                        <h2>SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?</h2>
                        <p>
                            When you interact with our platform or purchase CODY tokens, we collect the personal information you provide us such as your name, email address, and wallet address.
                        </p>
                        <p>
                            When you browse our website, we also automatically receive your computer&apos;s internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.
                        </p>
                        <p>
                            Email marketing (if applicable): With your permission, we may send you emails about CODY token updates, new features, and other relevant information.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>SECTION 2 - CONSENT</h2>
                        <h3>How do you get my consent?</h3>
                        <p>
                            When you provide us with personal information to complete a transaction, verify your wallet, or interact with our platform, we imply that you consent to our collecting it and using it for that specific reason only.
                        </p>
                        <p>
                            If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.
                        </p>
                        
                        <h3>How do I withdraw my consent?</h3>
                        <p>
                            If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at any time, by contacting us at <a href="mailto:privacy@codytoken.com">privacy@codytoken.com</a>
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>SECTION 3 - DISCLOSURE</h2>
                        <p>
                            We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>SECTION 4 - DATA STORAGE</h2>
                        <p>
                            Our platform is hosted on secure servers. They provide us with the online platform that allows us to provide our services to you.
                        </p>
                        <p>
                            Your data is stored through our providers&apos; data storage, databases and the general application. They store your data on a secure server behind a firewall.
                        </p>
                        <p>
                            <strong>Payment:</strong> If you choose a direct payment gateway to complete your purchase, then your payment data is stored. It is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS). Your purchase transaction data is stored only as long as is necessary to complete your purchase transaction. After that is complete, your purchase transaction information is deleted.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>SECTION 5 - THIRD-PARTY SERVICES</h2>
                        <p>
                            In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us.
                        </p>
                        <p>
                            However, certain third-party service providers, such as payment gateways and other payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for your purchase-related transactions.
                        </p>
                        <p>
                            For these providers, we recommend that you read their privacy policies so you can understand the manner in which your personal information will be handled by these providers.
                        </p>
                        <p>
                            In particular, remember that certain providers may be located in or have facilities that are located in a different jurisdiction than either you or us. So if you elect to proceed with a transaction that involves the services of a third-party service provider, then your information may become subject to the laws of the jurisdiction(s) in which that service provider or its facilities are located.
                        </p>
                        <p>
                            As an example, if you are located in Canada and your transaction is processed by a payment gateway located in the United States, then your personal information used in completing that transaction may be subject to disclosure under United States legislation, including the Patriot Act.
                        </p>
                        <p>
                            Once you leave our website or are redirected to a third-party website or application, you are no longer governed by this Privacy Policy or our website&apos;s Terms of Service.
                        </p>
                        <p>
                            When you click on links on our website, they may direct you away from our site. We are not responsible for the privacy practices of other sites and encourage you to read their privacy statements.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>SECTION 6 - SECURITY</h2>
                        <p>
                            To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
                        </p>
                        <p>
                            If you provide us with your credit card information, the information is encrypted using secure socket layer technology (SSL) and stored with a AES-256 encryption. Although no method of transmission over the Internet or electronic storage is 100% secure, we follow all PCI-DSS requirements and implement additional generally accepted industry standards.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>SECTION 7 - AGE OF CONSENT</h2>
                        <p>
                            By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>SECTION 8 - CHANGES TO THIS PRIVACY POLICY</h2>
                        <p>
                            We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.
                        </p>
                        <p>
                            If our platform is acquired or merged with another company, your information may be transferred to the new owners so that we may continue to provide services to you.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>QUESTIONS AND CONTACT INFORMATION</h2>
                        <p>
                            If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information contact our Privacy Compliance Officer at <a href="mailto:privacy@codytoken.com">privacy@codytoken.com</a>
                        </p>
                    </section>

                </div>
            </main>
            <Footer />
        </div>
    );
}
