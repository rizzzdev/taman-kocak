import Form from "@/shared/components/ui/Form";

interface LoginFormProps {
  onSubmit: () => void;
}

const LoginForm = (props: LoginFormProps) => {
  const { onSubmit } = props;

  return (
    <Form onSubmit={onSubmit}>
      <Form.Input htmlFor="username" text="Username" type="text" />
      <Form.Input htmlFor="password" text="Password" type="password" />
      <Form.Toast />
      <Form.Button useMarginTop text="Login" />
    </Form>
  );
};

export default LoginForm;
