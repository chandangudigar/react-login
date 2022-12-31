import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
// [^\W_]{7,14}$
let userRegex = /^[a-z]/i;
let passRegex = /^(?=[^a-z]*[a-z])(?=\D*\d)[^:&.~\s]{5,20}$/;

let register_url = "http://localhost:4000/api/users/signup";

function Register() {
    const emailRef = useRef();

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);
    useEffect(() => {
        // const result = userRegex.test(email);
        setValidEmail(email);
    }, [email]);
    useEffect(() => {
        const result = userRegex.test(user);
        setValidName(result);
    }, [user]);
    useEffect(() => {
        const result = passRegex.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd]);
    useEffect(() => {
        setErrMsg("");
    }, [user, email, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const p1 = userRegex.test(user);
        const p2 = passRegex.test(pwd);
        if (!p1 || !p2 || !email) {
            setErrMsg("Invalid Entry!!");
            return;
        }
        try {
            const response = await axios.post(
                register_url,
                { email, name: user, password: pwd },
                {
                    headers: { "Content-Type": "application/json" },
                    // withCredentials: true,
                }
            );
            console.log(response);
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (!err?.response?.status === 409) {
                setErrMsg("Username Taken");
            } else {
                setErrMsg("Registration Failed");
            }
            console.log(err);
            errRef.current.focus();
        }
        console.log(user, pwd);
    };
    return (
        <>
            {success ? (
                <section>
                    Success <p>Sign In</p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} aria-live="assertive">
                        {errMsg}
                    </p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Email</label>
                        <input
                            type="text"
                            id="email"
                            autoComplete="false"
                            onChange={({ target }) => setEmail(target.value)}
                            required
                            ref={emailRef}
                            aria-invalid={validEmail ? "false" : true}
                            aria-describedby={"uidnote"}
                            // onFocus={() => setEmailFocus(true)}
                            // onBlur={() => setEmailFocus(false)}
                        />
                        <label htmlFor="username">User Name</label>
                        <input
                            type="text"
                            id="username"
                            autoComplete="false"
                            onChange={({ target }) => setUser(target.value)}
                            required
                            ref={userRef}
                            aria-invalid={validName ? "false" : true}
                            aria-describedby={"uidnote"}
                            // onFocus={() => setUserFocus(true)}
                            // onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote"> 4 to 24 character, must begin with a letter, Letters,numbers, underscores,hyphens allowed</p>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            // autoComplete="false"
                            onChange={({ target }) => setPwd(target.value)}
                            required
                            aria-invalid={validPwd ? "false" : true}
                            aria-describedby={"pwdnote"}
                            // onFocus={() => setPwdFocus(true)}
                            // onBlur={() => setPwdFocus(false)}
                        />
                        <p id="uidnote"> 4 to 24 character, must begin with a letter, Letters,numbers, underscores,hyphens allowed</p>
                        <label htmlFor="password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            // autoComplete="false"
                            onChange={({ target }) => setMatchPwd(target.value)}
                            required
                            aria-invalid={validMatch ? "false" : true}
                            aria-describedby={"confirmnote"}
                            // onFocus={() => setMatchFous(true)}
                            // onBlur={() => setMatchFous(false)}
                        />
                        <button>Sign Up</button>
                    </form>
                </section>
            )}
        </>
    );
}

export default Register;
