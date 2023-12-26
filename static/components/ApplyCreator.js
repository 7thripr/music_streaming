export default {
    template: `
        <div align="center">
        <img width="100" height="100" src="https://img.icons8.com/ios/100/reviewer-male.png" alt="reviewer-male"/>
            <h2 class="mb-4" style="margin: 20px">Terms and Conditions</h2>
            <p>
                <div class="container">
                **Terms and Conditions of Use for OSMusic**<br>
                Last Updated: 11-12-23<br><br>
                
                Welcome to OSMusic! These terms and conditions ("Terms") govern your use of OSMusic (the "App"), provided by [Your Company Name] ("we," "us," or "our"). By accessing or using the App, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use the App.<br><br>
                
                **1. Use of the App**<br><br>
                1.1. You must be at least [age] years old to use the App. By using the App, you affirm that you are of legal age to enter into these Terms.<br>
                1.2. You agree to use the App only for lawful purposes and in accordance with these Terms and all applicable laws and regulations.<br><br>
                
                **2. Account Registration**<br><br>
                2.1. To access certain features of the App, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process.<br>
                2.2. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.<br><br>
                
                **3. Content**<br><br>
                3.1. The App may allow you to access, listen to, and share music, playlists, and other content ("Content"). You agree not to reproduce, distribute, modify, or create derivative works based on the Content without our express consent.<br>
                3.2. You acknowledge that some Content may be provided by third-party providers and is subject to their terms and conditions.<br><br>
                
                **4. Intellectual Property**<br><br>
                4.1. The App and its content, features, and functionality are owned by OSIndustries or its licensors and are protected by intellectual property laws.<br>
                4.2. You are granted a limited, non-exclusive, revocable license to use the App for personal, non-commercial purposes.<br><br>
                
                **5. Termination**<br><br>
                5.1. We reserve the right to terminate or suspend your account and access to the App at our sole discretion, without notice, for any reason, including if you violate these Terms.<br><br>
                
                **6. Privacy**<br><br>
                6.1. Your use of the App is also governed by our Privacy Policy, which can be found [provide a link to your Privacy Policy].<br><br>
                
                **7. Changes to Terms**<br><br>
                7.1. We may update or revise these Terms from time to time. Your continued use of the App after any such changes will constitute your acceptance of the updated Terms.<br><br>
                
                **8. Contact Us**<br><br>
                8.1. If you have any questions about these Terms, please contact us at osmusic@os.com.<br><br>
                
                Thank you for using OSMusic!<br>
                
                </div>
            </p>

            <form id="acceptTermsForm">
                <div class="mb-3 form-check">
                    <p>Do you accept the T/C?
                    </p>
                </div>
                <button v-if="!terms" type="button" class="btn btn-primary" @click="acceptCheckbox()">Yes</button>
                <button v-if="terms" type="button" class="btn btn-success" @click="acceptTerms()">Accept</button>
                <button v-if="terms" type="button" class="btn btn-danger" @click="rejectTerms()">Reject</button>
            </form>
        </div>
    `,
    data() {
        return {
            terms: false,
            email: localStorage.getItem('uniqueid'),
        };
    },
    methods: {
        acceptCheckbox() {
            this.terms = true;
        },
        async acceptTerms() {
                        if (localStorage.getItem("role") === 'user' || this.terms === true) {
                            const res = await fetch('/api/applycreator', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authentication-Token': localStorage.getItem('token'),
                                },
                                body: JSON.stringify({ email: this.email }),
                            });
                            if (res.ok) {
                                console.log('Application submitted successfully');
                                // Update the role to "creator" in localStorage
                                localStorage.setItem("role", "creator");
                                // Redirect the user to the profile page
                                this.$router.push('/profile');
                            } else {
                                console.error('Failed to submit application');
                            }
                        } else {
                            console.warn('Only users with the role "user" can apply as a creator.');
                            // You can also display a message to the user or redirect them to another page
                        }
                    },
        rejectTerms() {
            this.terms = false;
            this.$router.push('/dashboard');
        },
    },
};
