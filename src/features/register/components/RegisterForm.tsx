import Form from "@/shared/components/ui/Form";

interface RegisterFormProps {
  onSubmit: () => void;
}

const RegisterForm = (props: RegisterFormProps) => {
  const { onSubmit } = props;

  return (
    <Form onSubmit={onSubmit}>
      <Form.Input htmlFor="fullname" text="Fullname" type="text" />
      <Form.File htmlFor="image" text="Profile Picture" />
      <Form.Input htmlFor="username" text="Username" type="text" />
      <Form.Input htmlFor="password" text="Password" type="password" />
      <Form.Toast />
      <Form.Button useMarginTop text="Register" />
    </Form>
  );
};

export default RegisterForm;
