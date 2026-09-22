import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../../../stores/auth.store'

const registrationSchema = z.object({
    firstName: z.string().min(3, 'First name is required'),
    lastName: z.string().min(3, 'Last name is required'),
    username: z.string().min(3, 'Username is required'),
    password: z.string().min(8, 'Password must have atleast 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['JOBSEEKER', 'JOBPROVIDER'], {
        message: 'Please select a role'
    })
})
.refine(
    data => data.password === data.confirmPassword, {
        message: 'Passwords dont match',
        path: ['confirmPassword']
    }
)

type RegisterForm = z.infer<typeof registrationSchema>

export default function RegistrationPage() {

    const navigate = useNavigate()

    const isLoading = useAuthStore(state => state.isLoading)

    const registerUser = useAuthStore(state => state.register)

    const [error, setError] = useState('')

    const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm<RegisterForm>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {role: 'JOBSEEKER'}
    })

    const selectedRole = watch('role')

    async function onSubmit(data: RegisterForm){
        setError('')

        try{
            await registerUser(data)
            navigate('/')
        }catch (error){
            setError(
                error instanceof Error
                    ? error.message
                    : 'Registration failed'
            )
        }
    }

    return (
        <main className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
            <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-lg'>
                <div className='mb-8 text-center'>
                    <h1 className='text-3xl font-bold'>
                        Joblet
                    </h1>
                    <p className='mt-2 text-gray-500'>
                        Create your own Joblet account
                    </p>
                </div>

                {error && (
                <div className='mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
                    {error}
                </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    <div>
                        <label className='mb-1 block text-sm font-medium'>
                            First Name
                        </label>

                        <input
                            {...register('firstName')}
                            className='w-full rounded-lg border px-3 py-3 outline-none focus:ring-2'
                            placeholder='John'
                        />

                        {errors.firstName && (
                            <p className='mt-1 text-sm text-red-600'>
                                {
                                    errors.firstName.message
                                }
                            </p>
                        )}
                    </div>

                    <div>
                        <label className='mb-1 block text-sm font-medium'>
                            Last Name
                        </label>
                        <input
                            {...register('lastName')}
                            className='w-full rounded-lg border px-3 py-3 outline-none focus:ring-2'
                            placeholder='Doe' 
                         />

                         {errors.lastName && (
                            <p className='mt-1 text-sm text-red-600'>
                                {
                                    errors.lastName.message
                                }
                            </p>
                         )}
                    </div>

                    <div>
                        <label className='mb-1 block text-sm font-medium'>
                            Username
                        </label>

                        <input
                            {...register('username')}
                            className='w-full rounded-lg border px-3 py-3 outline-none focus:ring-2'
                            placeholder='JohnD'
                        />

                        {errors.username && (
                            <p className='mt-1 text-sm text-red-600'>
                                {
                                    errors.username.message
                                }
                            </p>
                        )}
                    </div>

                    <div>
                        <label className='mb-1 block text-sm font-medium'>
                            Password
                        </label>

                        <input
                            {...register('password')}
                            className='w-full rounded-lg border px-3 py-3 outline-none focus:ring-2'
                            placeholder='secure-password' 
                        />

                        {errors.password && (
                            <p className='mt-1 text-sm text-red-600'>
                                {
                                    errors.password.message
                                }
                            </p>
                        )}
                    </div>

                    <div>
                        <label className='mb-1 block text-sm font-medium'>
                            Confirm Password
                        </label>

                        <input
                            {...register('confirmPassword')}
                            className='w-full rounded-lg border px-3 py-3 outline-none focus:ring-2'
                            placeholder='repeated-password'
                        />

                        {errors.confirmPassword && (
                            <p className='mt-1 text-sm text-red-600'>
                                {
                                    errors.confirmPassword.message
                                }
                            </p>
                        )}

                    </div>

                    <div>
                        <div className='w-full flex gap-4'>
                            <button
                                type='button'
                                onClick={() => setValue('role', 'JOBSEEKER')}
                                className={`flex-1 rounded-lg border px-4 py-3 font-medium transition
                                    ${
                                        selectedRole === 'JOBSEEKER'
                                        ? 'border-gray-900 bg-gray-900 text-white'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900'
                                    }
                                `}
                            >
                                Job Seeker
                            </button>

                            <button
                                type='button'
                                onClick={() => setValue('role', 'JOBPROVIDER')}
                                className={`flex-1 rounded-lg border px-4 py-3 font-medium transition
                                    ${
                                        selectedRole === 'JOBPROVIDER'
                                        ? 'border-gray-900 bg-gray-900 text-white'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900'
                                    }
                                `}
                            >
                                Job Provider
                            </button>
                        </div>

                        {errors.role && (
                            <p className='mt-1 text-sm text-red-600'>
                                {errors.role.message }
                            </p>
                        )}
                    </div>

                    

                    <button
                        type='submit'
                        disabled={isLoading}
                        className='w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white disabled:opacity-50'
                    >
                        {isLoading
                            ? 'Creating account...'
                            : 'Create account'
                        }

                    </button>
                    
                </form>

                <p className='mt-6 text-center text-sm text-gray-500'>
                    Already have an account {''}
                    <Link
                        to='/login'
                        className='font-semibold text-gray-900'
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </main>
    )

    
}
