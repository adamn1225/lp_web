import React, { useState } from 'react';

const TextArea: React.FC = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [error, setError] = useState('');

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
        if (e.target.checked) {
            setError('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isChecked) {
            setError('You must accept the terms to proceed.');
        } else {
            // Handle form submission
            console.log('Form submitted');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="px-4 w-full text-slate-800 text-sm mb-4 max-h-36 overflow-y-auto my-4 border border-gray-500/50">
            <strong><h2 className='text-lg mb-2'>Rental Agreement</h2></strong>
            <strong><p>Agreement between User and line-properties.com</p></strong>

            <p>Welcome to line-properties.com. The line-properties.com website (the "Site") is comprised of
                various web pages operated by Line Properties Inc ("Line Properties inc"). line-properties.com is
                offered to you conditioned on your acceptance without modification of the terms, conditions, and
                notices contained herein (the "Terms"). Your use of line-properties.com constitutes your agreement
                to all such Terms. Please read these terms carefully, and keep a copy of them for your reference.
                <br /><br />
                line-properties.com is an E-Commerce Site.
                <br /><br />
                We are a property vacation rental management company offering vacation rental properties to the
                public and we offer management for property owners.
                </p>

            <strong><p>Electronic Communications</p></strong>

            <p>Visiting line-properties.com or sending emails to Line Properties inc constitutes electronic
                communications. You consent to receive electronic communications and you agree that all
                agreements, notices, disclosures and other communications that we provide to you electronically,
                via email and on the Site, satisfy any legal requirement that such communications be in writing.</p>

            <strong><p>Children Under Thirteen</p></strong>

            <p>Line Properties inc does not knowingly collect, either online or offline, personal information from
                persons under the age of thirteen. If you are under 18, you may use line-properties.com only with
                permission of a parent or guardian.</p>

            <strong><p>Cancellation/Refund Policy</p></strong>
            
            <p>We issue a full refund for cancellations 30 days before check-in. We issue a full refund for
                cancellations within 48 hours of booking only if the check-in date is at least 14 days away. We
                issue a 50% refund for cancellations at least 14 days before check-in. We do not issue refunds for
                cancellations made within 14 days of check-in.</p>

            <strong><p>Links to Third Party Sites/Third Party Services</p></strong>

            <p>line-properties.com may contain links to other websites ("Linked Sites"). The Linked Sites are not
                under the control of Line Properties inc and Line Properties inc is not responsible for the contents
                of any Linked Site, including without limitation any link contained in a Linked Site, or any changes
                or updates to a Linked Site. Line Properties inc is providing these links to you only as a
                convenience, and the inclusion of any link does not imply endorsement by Line Properties inc of
                the site or any association with its operators.
                
                <br /><br />

                Certain services made available via line-properties.com are delivered by third party sites and
                organizations. By using any product, service or functionality originating from the line-
                properties.com domain, you hereby acknowledge and consent that Line Properties inc may share
                such information and data with any third party with whom Line Properties inc has a contractual
                relationship to provide the requested product, service or functionality on behalf of line-properties.com users and customers.

                </p>

            <strong><p>No Unlawful or Prohibited Use/Intellectual Property</p></strong>

            <p>You are granted a non-exclusive, non-transferable, revocable license to access and use line-
                properties.com strictly in accordance with these terms of use. As a condition of your use of the
                Site, you warrant to Line Properties inc that you will not use the Site for any purpose that is
                unlawful or prohibited by these Terms. You may not use the Site in any manner which could
                damage, disable, overburden, or impair the Site or interfere with any other party's use and
                enjoyment of the Site. You may not obtain or attempt to obtain any materials or information
                through any means not intentionally made available or provided for through the Site.

                <br /><br />

                All content included as part of the Service, such as text, graphics, logos, images, as well as the
                compilation thereof, and any software used on the Site, is the property of Line Properties inc or its
                suppliers and protected by copyright and other laws that protect intellectual property and
                proprietary rights. You agree to observe and abide by all copyright and other proprietary notices,
                legends or other restrictions contained in any such content and will not make any changes thereto.

                <br /><br />

                You will not modify, publish, transmit, reverse engineer, participate in the transfer or sale, create
                derivative works, or in any way exploit any of the content, in whole or in part, found on the Site.
                Line Properties inc content is not for resale. Your use of the Site does not entitle you to make any
                unauthorized use of any protected content, and in particular you will not delete or alter any
                proprietary rights or attribution notices in any content. You will use protected content solely for
                your personal use, and will make no other use of the content without the express written
                permission of Line Properties inc and the copyright owner. You agree that you do not acquire any
                ownership rights in any protected content. We do not grant you any licenses, express or implied,
                to the intellectual property of Line Properties inc or our licensors except as expressly authorized by
                these Terms.</p>

            <strong><p>International Users</p></strong>

            <p>The Service is controlled, operated and administered by Line Properties inc from our offices within
                the USA. If you access the Service from a location outside the USA, you are responsible for
                compliance with all local laws. You agree that you will not use the Line Properties inc Content
                accessed through line-properties.com in any country or in any manner prohibited by any applicable
                laws, restrictions or regulations.</p>

            <strong><p>Indemnification</p></strong>

            <p>You agree to indemnify, defend and hold harmless Line Properties inc, its officers, directors,
                employees, agents and third parties, for any losses, costs, liabilities and expenses (including
                reasonable attorney's fees) relating to or arising out of your use of or inability to use the Site or
                services, any user postings made by you, your violation of any terms of this Agreement or your
                violation of any rights of a third party, or your violation of any applicable laws, rules or regulations.
                Line Properties inc reserves the right, at its own cost, to assume the exclusive defense and control
                of any matter otherwise subject to indemnification by you, in which event you will fully cooperate
                with Line Properties inc in asserting any available defenses.</p>

            <strong><p>Class Action Waiver</p></strong>

            <p>
                In the event the parties are not able to resolve any dispute between them arising out of or
                concerning these Terms and Conditions, or any provisions hereof, whether in contract, tort, or
                otherwise at law or in equity for damages or any other relief, then such dispute shall be resolved
                only by final and binding arbitration pursuant to the Federal Arbitration Act, conducted by a single
                neutral arbitrator and administered by the American Arbitration Association, or a similar arbitration
                service selected by the parties, in a location mutually agreed upon by the parties. The arbitrator's
                award shall be final, and judgment may be entered upon it in any court having jurisdiction. In the
                event that any legal or equitable action, proceeding or arbitration arises out of or concerns these
                Terms and Conditions, the prevailing party shall be entitled to recover its costs and reasonable
                attorney's fees. The parties agree to arbitrate all disputes and claims in regards to these Terms and
                Conditions or any disputes arising as a result of these Terms and Conditions, whether directly or
                indirectly, including Tort claims that are a result of these Terms and Conditions. The parties agree
                that the Federal Arbitration Act governs the interpretation and enforcement of this provision. The
                entire dispute, including the scope and enforceability of this arbitration provision shall be
                determined by the Arbitrator. This arbitration provision shall survive the termination of these Terms
                and Conditions.</p>

            <strong><p>Class Action Waiver</p></strong>

            <p>Any arbitration under these Terms and Conditions will take place on an individual basis; class
                arbitrations and class/representative/collective actions are not permitted. THE PARTIES AGREE
                THAT A PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY IN EACH'S
                INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
                PUTATIVE CLASS, COLLECTIVE AND/ OR REPRESENTATIVE PROCEEDING, SUCH
                AS IN THE FORM OF A PRIVATE ATTORNEY GENERAL ACTION AGAINST THE
                OTHER. Further, unless both you and Line Properties inc agree otherwise, the arbitrator may not
                consolidate more than one person's claims, and may not otherwise preside over any form of a
                representative or class proceeding.</p>

            <strong><p>Liability Disclaimer</p></strong>

            <p>THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR
                AVAILABLE THROUGH THE SITE MAY INCLUDE INACCURACIES OR
                TYPOGRAPHICAL ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE
                INFORMATION HEREIN. LINE PROPERTIES INC AND/OR ITS SUPPLIERS MAY
                MAKE IMPROVEMENTS AND/OR CHANGES IN THE SITE AT ANY TIME.
                LINE PROPERTIES INC AND/OR ITS SUPPLIERS MAKE NO REPRESENTATIONS
                ABOUT THE SUITABILITY, RELIABILITY, AVAILABILITY, TIMELINESS, AND
                ACCURACY OF THE INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND
                RELATED GRAPHICS CONTAINED ON THE SITE FOR ANY PURPOSE. TO THE
                MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ALL SUCH
                INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS
                ARE PROVIDED "AS IS" WITHOUT WARRANTY OR CONDITION OF ANY KIND.
                LINE PROPERTIES INC AND/OR ITS SUPPLIERS HEREBY DISCLAIM ALL
                WARRANTIES AND CONDITIONS WITH REGARD TO THIS INFORMATION,
                This is a RocketLawyer.com document.
                Page 3 of 5SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS, INCLUDING ALL
                IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                SHALL LINE PROPERTIES INC AND/OR ITS SUPPLIERS BE LIABLE FOR ANY
                DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL
                DAMAGES OR ANY DAMAGES WHATSOEVER INCLUDING, WITHOUT
                LIMITATION, DAMAGES FOR LOSS OF USE, DATA OR PROFITS, ARISING OUT OF
                OR IN ANY WAY CONNECTED WITH THE USE OR PERFORMANCE OF THE SITE,
                WITH THE DELAY OR INABILITY TO USE THE SITE OR RELATED SERVICES, THE
                PROVISION OF OR FAILURE TO PROVIDE SERVICES, OR FOR ANY
                INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS
                OBTAINED THROUGH THE SITE, OR OTHERWISE ARISING OUT OF THE USE OF
                THE SITE, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT
                LIABILITY OR OTHERWISE, EVEN IF LINE PROPERTIES INC OR ANY OF ITS
                SUPPLIERS HAS BEEN ADVISED OF THE POSSIBILITY OF DAMAGES. BECAUSE
                SOME STATES/JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR
                LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES,
                THE ABOVE LIMITATION MAY NOT APPLY TO YOU. IF YOU ARE DISSATISFIED
                WITH ANY PORTION OF THE SITE, OR WITH ANY OF THESE TERMS OF USE,
                YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE SITE.</p>

            <strong><p>Termination/Access Restriction</p></strong>

            <p>Line Properties inc reserves the right, in its sole discretion, to terminate your access to the Site and
                the related services or any portion thereof at any time, without notice. To the maximum extent
                permitted by law, this agreement is governed by the laws of the State of South Carolina and you
                hereby consent to the exclusive jurisdiction and venue of courts in South Carolina in all disputes
                arising out of or relating to the use of the Site. Use of the Site is unauthorized in any jurisdiction that
                does not give effect to all provisions of these Terms, including, without limitation, this section.
                You agree that no joint venture, partnership, employment, or agency relationship exists between
                you and Line Properties inc as a result of this agreement or use of the Site. Line Properties inc's
                performance of this agreement is subject to existing laws and legal process, and nothing contained
                in this agreement is in derogation of Line Properties inc's right to comply with governmental, court
                and law enforcement requests or requirements relating to your use of the Site or information
                provided to or gathered by Line Properties inc with respect to such use. If any part of this
                agreement is determined to be invalid or unenforceable pursuant to applicable law including, but
                not limited to, the warranty disclaimers and liability limitations set forth above, then the invalid or
                unenforceable provision will be deemed superseded by a valid, enforceable provision that most
                closely matches the intent of the original provision and the remainder of the agreement shall
                continue in effect.
                Unless otherwise specified herein, this agreement constitutes the entire agreement between the user
                and Line Properties inc with respect to the Site and it supersedes all prior or contemporaneous
                This is a RocketLawyer.com document.
                Page 4 of 5communications and proposals, whether electronic, oral or written, between the user and Line
                Properties inc with respect to the Site. A printed version of this agreement and of any notice given
                in electronic form shall be admissible in judicial or administrative proceedings based upon or
                relating to this agreement to the same extent and subject to the same conditions as other business
                documents and records originally generated and maintained in printed form. It is the express wish
                to the parties that this agreement and all related documents be written in English.</p>

            <strong><p>Changes to Terms</p></strong>

            <p>Line Properties inc reserves the right, in its sole discretion, to change the Terms under which line-
                properties.com is offered. The most current version of the Terms will supersede all previous versions.
                Line Properties inc encourages you to periodically review the Terms to stay informed of our updates.</p>

            <strong><p>Contact Us</p></strong>

            <p>Line Properties inc welcomes your questions or comments regarding the Terms:
                <br /><br />
                Line Properties Inc
                <br />
                600 16th Ave N #A
                <br />
                Myrtle Beach, South Carolina 29577
                <br />
                Email Address: lineproperties.office@gmail.com
                <br />
                Telephone number: 843-222-3769
                <br />
                Effective as of October 20, 2024</p>
                

            <div className="mt-4">
                <input
                    type="checkbox"
                    id="terms"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="terms" className="ml-2">I accept the terms and conditions</label>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <button type="submit" className="mt-4 bg-blue-500 text-white py-1 px-4 rounded">
                Submit
            </button>
        </form>
    );
};

export default TextArea;