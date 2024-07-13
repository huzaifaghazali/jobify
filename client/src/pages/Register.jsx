import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Wrapper from '../assets/wrappers/RegisterAndLogin';
import FormRow from '../components/FormRow';

const Register = () => {
  return (
    <Wrapper>
      <form className='form'>
        <Logo />
        <h4>Register</h4>

        <FormRow type='text' name='name' />
        <FormRow type='text' name='lasName' labelText='Last Name' />
        <FormRow type='text' name='location' />
        <FormRow type='email' name='email' />
        <FormRow type='password' name='password' />

        <button type='submit' className='btn btn-block'>
          submit
        </button>
        <p>
          Already a member?
          <Link to='/login' className='member-btn'>
            Login Page
          </Link>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
