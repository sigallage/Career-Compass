import React from 'react';
import './Contact.css';

const Contact = () => {
    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        formData.append("access_key", "YOUR_ACCESS_KEY_HERE");

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: json
        }).then((res) => res.json()); 
        
        if(res.success){
            console.log("Success:", res);
        }
    };

    return (
        <section className="contact">
            <form onSubmit={onSubmit}>
                <h2>Contact Form</h2>
                <div className="input-box">
                    <label>Full Name</label>
                    <input type="text" className="field" placeholder='Enter your name' name= 'name' required />
                </div>
                
                <div className="input-box">
                    <label>Email Address</label>
                    <input type="email" className="field" placeholder='Enter your email' email= 'email' required />
                </div>

                <div className="input-box">
                    <label>Your Message</label>
                    <textarea name="" id="" className="field mess" placeholder='Enter your message' required></textarea>
                </div>
                <button type="submit">Send Message</button>
            </form>
        </section>
    );
}