import { useLoaderData } from 'react-router-dom';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { JOB_STATUS, JOB_TYPE } from '../../../server/utils/constants';
import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { FormRow, SubmitBtn } from '../components';
import FormRowSelect from '../components/FormRowSelect';

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/jobs/${params.id}`);
    console.log(data);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect('/dashboard/all-jobs');
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.patch(`/jobs/${params.id}`, data);
    toast.success('Job updated successfully');
    return redirect('/dashboard/all-jobs');
  } catch (error) {
    toast.error(error.response.data.msg);
    return error;
  }
};

const EditJob = () => {
  const { job } = useLoaderData();

  return (
    <Wrapper>
      <Form method='POST' className='form'>
        <h4 className='form-title'>Edit Job</h4>
        <div className='form-center'>
          <FormRow type='text' name='position' defaultValue={job.position} />
          <FormRow type='text' name='company' defaultValue={job.company} />
          <FormRow
            type='text'
            labelText='job location'
            name='jobLocation'
            defaultValue={job.jobLocation}
          />
          <FormRowSelect
            name='jobStatus'
            labelText='job status'
            defaultValue={job.jobStatus}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            name='jobType'
            labelText='job type'
            defaultValue={job.jobType}
            list={Object.values(JOB_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditJob;
