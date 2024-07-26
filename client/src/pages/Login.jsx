import { Link, Form, redirect, useNavigation } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLogin';
import { Logo, FormRow } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const errors = { msg: '' };
  if (data.password.length < 3) {
    errors.msg = 'password too short';
    return errors;
  }

  try {
    await customFetch.post('/auth/login', data);
    toast.success('Login successful');
    return redirect('/dashboard');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    errors.msg = error.response.data.msg;
    return error;
  }
};

const Login = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <Wrapper>
      <Form method='POST' className='form'>
        <Logo />
        <h4>Login</h4>

        <FormRow type='email' name='email' />
        <FormRow type='password' name='password' />

        <button type='submit' className='btn btn-block' disabled={isSubmitting}>
          {/* {isSubmitting ? 'submitting...' : 'submit'} */}
          submit
        </button>
        <button type='button' className='btn btn-block'>
          explore the app
        </button>

        <p>
          Not a member yet?
          <Link to='/register' className='member-btn'>
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Login;
