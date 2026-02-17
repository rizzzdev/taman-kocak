import Form from "@/shared/components/ui/Form";

interface RegisterFormProps {
  onSubmit: () => void;
}

const AccountSettingsForm = (props: RegisterFormProps) => {
  const { onSubmit } = props;

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <Form onSubmit={onSubmit}>
        <Form.Input htmlFor="fullname" text="Fullname" type="text" />
        <Form.File htmlFor="image" text="Profile Picture" />
        <Form.Input htmlFor="username" text="Username" type="text" />
        <Form.Input htmlFor="password" text="Password" type="password" />
        <Form.Button useMarginTop marginTop="4px" text="Update" />
      </Form>
    </div>
  );
};

export default AccountSettingsForm;
