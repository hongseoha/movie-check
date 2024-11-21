import Button from '@/_components/Button';

interface ActivityCommonFormProps {
  // buttonDisable: boolean;
  buttonTitle: string;
  children: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  title: string;
}

function FormContainer({ onSubmit, title, buttonTitle, children }: ActivityCommonFormProps) {
  return (
    <form className="grid gap-6" onSubmit={onSubmit}>
      <div className="flex flex-wrap justify-between">
        <h2 className="text-3xl font-bold leading-[1.3]">{title}</h2>
        <Button type="submit" variant="black" className="h-12 w-[120px]">
          {buttonTitle}
        </Button>
      </div>
      <div className="grid gap-6">{children}</div>
    </form>
  );
}

export default FormContainer;
