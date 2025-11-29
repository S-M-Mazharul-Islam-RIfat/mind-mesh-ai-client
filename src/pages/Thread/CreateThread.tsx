import { Form, Input, Button, Card, Typography, Select } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateThreadMutation } from '../../redux/features/thread/threadApi';
import { toast } from 'sonner';
import type { RootState } from '../../redux/store';

const { Title } = Typography;
const { TextArea } = Input;

const CreateThread = () => {
   const navigate = useNavigate();
   const user = useSelector((state: RootState) => state.auth.user);

   const tagOptions = [
      { label: 'General', value: 'general' },
      { label: 'Discussion', value: 'discussion' },
      { label: 'Question', value: 'question' },
      { label: 'Javascript', value: 'javascript' },
      { label: 'Node js', value: 'Node js' },
      { label: 'React js', value: 'react js' },
      { label: 'Next js', value: 'next js' },
      { label: 'Golang', value: 'golang' },
      { label: 'Backend Development', value: 'backendDevelopment' },
      { label: 'DevOps', value: 'DevOps' },
   ];

   const [createThread] = useCreateThreadMutation();

   const onFinish = async (values: { title: string; content: string; tags: string[] }) => {
      const toastId = toast.loading('Posting...');
      try {
         const threadInfo = {
            author: user?.id,
            title: values.title,
            threadBody: values.content,
            tags: values.tags
         }
         await createThread(threadInfo).unwrap();
         navigate(`/`);
         toast.success('Posted', { id: toastId });
      }
      catch {
         toast.error('Something went wrong', { id: toastId });
      }
   };

   return (
      <div className="max-w-4xl mx-auto space-y-6">
         <Button
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate('/')}
         >
            Back to Threads
         </Button>
         <Card>
            <Title level={2}>Create New Thread</Title>
            <Form
               layout="vertical"
               onFinish={onFinish}
               size="large"
            >
               <Form.Item
                  name="title"
                  label="Thread Title"
                  rules={[
                     { required: true, message: 'Please enter a title!' },
                     { min: 5, message: 'Title must be at least 5 characters!' },
                  ]}
               >
                  <Input
                     placeholder="Enter a descriptive title..."
                     maxLength={200}
                     showCount
                  />
               </Form.Item>
               <Form.Item
                  name="content"
                  label="Content"
                  rules={[
                     { required: true, message: 'Please enter content!' },
                     { min: 20, message: 'Content must be at least 20 characters!' },
                  ]}
               >
                  <TextArea
                     rows={8}
                     placeholder="Write your thread content..."
                     maxLength={5000}
                     showCount
                  />
               </Form.Item>
               <Form.Item
                  name="tags"
                  label="Tags"
                  rules={[
                     { required: true, message: 'Please select at least one tag!' },
                  ]}
               >
                  <Select
                     mode="multiple"
                     placeholder="Select relevant tags..."
                     options={tagOptions}
                     maxTagCount="responsive"
                  />
               </Form.Item>
               <Form.Item>
                  <Button
                     type="primary"
                     htmlType="submit"
                     size="large"
                     block
                  >
                     Create Thread
                  </Button>
               </Form.Item>
            </Form>
         </Card>
      </div>
   );
};

export default CreateThread;
