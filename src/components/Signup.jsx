import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Input, Logo, Button } from './index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'


function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const { register, handleSubmit, getValues } = useForm()

    const create = async (data) => {
        // empty error
        setError("")
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                const userData = await authService.getCurrentUser()
                // need to update store bcz new member is added 
                if (userData) dispatch(login(userData))
                navigate("/")
                // forcefully go to root of web
            }
        } catch (error) {
            setError(error.message)
        }
    }

    // Custom validation for password confirmation
    const validatePasswordConfirmation = (value) => {
        const password = getValues('password');
        return password === value || 'Passwords do not match';
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>

                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>

                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline">
                        Sign In
                    </Link>
                </p>

                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>

                        <Input
                            label='Full Name: '
                            placeholder='Enter your Name'
                            {...register('name', {
                                required: true,
                            })}
                        />

                        <Input
                            label="Email: "
                            placeholder='Enter your Email'
                            type='email'
                            {...register('email', {
                                required: true,
                                validate: {
                                    // this is called regex pattern below pattern used to validate the email address
                                    matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />

                        <Input
                            label='Password: '
                            placeholder='Enter your Password'
                            type='password'
                            {...register('password', {
                                required: true,
                            })}
                        />

                        <Input
                            label='Confirm Password'
                            placeholder='Confirm your Password'
                            type='password'
                            {...register('confirmPassword', {
                                required: true,
                                validate: validatePasswordConfirmation,
                            })}
                        />

                        <Button
                            type='submit'
                            className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default Signup