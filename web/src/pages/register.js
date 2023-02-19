import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { register } from '../actions/auth';
import PageLayout from '../components/PageLayout';
import CircularProgress from '@mui/material/CircularProgress';
import router from 'next/router';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const register_success = useSelector(state => state.auth.register_success);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const loading = useSelector(state => state.auth.loading);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
    });

    const {
        username,
        email,
        password,
        password2
    } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        if (dispatch && dispatch !== null && dispatch !== undefined)
            dispatch(register(email, username, password, password2));
    };

    if (typeof window !== 'undefined' && isAuthenticated)
        router.push('/home');
    if (register_success)
        router.push('/login');

    return (
        <PageLayout
            title='httpOnly Auth | Register'
            content='Resiger page for this auth tutorial on httpOnly cookies'
        >
            <h1 className='display-4 mt-5'>Register Page</h1>
            <form className='bg-light p-5 mt-5 mb-5' onSubmit={onSubmit}>
                <h3>Create An Account</h3>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='text'
                        name='email'
                        placeholder='Email *'
                        onChange={onChange}
                        value={email}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='text'
                        name='username'
                        placeholder='Username *'
                        onChange={onChange}
                        value={username}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        name='password'
                        placeholder='Password *'
                        onChange={onChange}
                        value={password}
                        minLength='8'
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        name='password2'
                        placeholder='Confirm Password *'
                        onChange={onChange}
                        value={password2}
                        minLength='8'
                        required
                    />
                </div>
                {
                    loading ? (
                        <div className='d-flex justify-content-center align-items-center mt-5'>
                            <CircularProgress />
                        </div>
                    ) : (
                        <button className='btn btn-primary mt-5' type='submit'>
                            Create Account
                        </button>
                    )
                }
            </form>
        </PageLayout>
    );
};

export default RegisterPage;
