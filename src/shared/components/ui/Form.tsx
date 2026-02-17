import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { atom, useAtom, useAtomValue } from "jotai";
import {
  ChangeEvent,
  MouseEvent,
  ReactNode,
  SubmitEvent,
  useRef,
  useState,
} from "react";

const formState: Record<string, string> = {};
export const formStateAtom = atom(formState);

interface FormProps {
  onSubmit?: () => void;
  children?: ReactNode;
}

interface TextAreaProps {
  htmlFor: string;
  text?: string;
  color?: "primary" | "text";
  minHeight?: number;
}

interface FileProps {
  htmlFor: string;
  text?: string;
}

interface InputProps {
  htmlFor: string;
  text?: string;
  type?: "text" | "password";
}

interface ButtonProps {
  text?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  useMarginTop?: boolean;
  marginTop?: string;
  color?: "primary" | "text";
}

const TextArea = (props: TextAreaProps) => {
  const { htmlFor, text, color, minHeight } = props;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [formState, setFormState] = useAtom(formStateAtom);
  const value = formState[htmlFor] || "";

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();

    setFormState((prev) => {
      return {
        ...prev,
        [htmlFor]: event.target.value,
      };
    });
  };

  const handleInput = () => {
    const element = textAreaRef.current;
    if (!element) {
      return;
    }

    element.style.height = "auto"; // reset dulu
    element.style.height = `${element.scrollHeight}px`; // set sesuai konten
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-1">
      <label className="w-full text-sm" htmlFor={htmlFor}>
        {text || ""}
      </label>
      <textarea
        className={`w-full text-sm p-2 border ${color === "primary" ? "border-primary text-primary" : "border-text text-text"} rounded-md overflow-hidden resize-none outline-none`}
        ref={textAreaRef}
        id={htmlFor}
        value={value}
        onChange={onChange}
        onInput={handleInput}
        style={{
          minHeight: minHeight + "px",
        }}
      ></textarea>
    </div>
  );
};

const File = (props: FileProps) => {
  const { htmlFor, text } = props;
  const [fileName, setFileName] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files;
    if (file) {
      setFileName(file[0]?.name || "");
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-1">
      <label className="w-full text-sm" htmlFor={htmlFor}>
        {text}
      </label>
      <label className="flex flex-col items-center justify-center w-full p-6 border rounded-md cursor-pointer transition">
        <input
          type="file"
          className="hidden"
          id={htmlFor}
          onChange={handleChange}
          accept="image/*"
        />

        <span className="text-gray-600">
          {fileName ? fileName : "Klik untuk upload file"}
        </span>

        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</span>
      </label>
    </div>
  );
};

const Input = (props: InputProps) => {
  const { htmlFor, text, type } = props;
  const [formState, setFormState] = useAtom(formStateAtom);
  const [isPasswordReveal, setIsPasswordReveal] = useState(false);

  const handleRevealPassword = () => {
    setIsPasswordReveal(!isPasswordReveal);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      [htmlFor]: event.target.value,
    }));
  };

  return (
    <div className="w-full flex flex-col gap-2 justify-center items-center">
      <label className="w-full text-sm" htmlFor={htmlFor}>
        {text}
      </label>
      <div className="w-full flex justify-center items-center text-sm p-2 border border-text text-text rounded-md relative gap-2">
        <input
          id={htmlFor}
          type={
            type === "password"
              ? isPasswordReveal
                ? "text"
                : "password"
              : "text"
          }
          className="w-full outline-none"
          value={formState[htmlFor] || ""}
          onChange={handleChange}
        ></input>
        {type === "password" && !isPasswordReveal && (
          <EyeIcon
            size={24}
            className="text-text cursor-pointer"
            onClick={handleRevealPassword}
          />
        )}
        {type === "password" && isPasswordReveal && (
          <EyeSlashIcon
            size={24}
            className="text-text cursor-pointer"
            onClick={handleRevealPassword}
          />
        )}
      </div>
    </div>
  );
};

interface ToastState {
  isVisible: boolean;
  type: "error" | "success";
  messages: string[];
}

export const toastStateAtom = atom<ToastState>({
  isVisible: false,
  type: "error",
  messages: [],
});

const Toast = () => {
  const toastState = useAtomValue(toastStateAtom);

  if (toastState?.isVisible) {
    return (
      <div
        className={`w-full flex flex-col justify-center items-center text-sm p-2 border ${toastState.type === "error" ? "border-red-500 text-red-500" : "border-green-500 text-green-500"} rounded-md relative gap-2`}
      >
        <h3 className="w-full text-md font-semibold">
          {toastState.type === "error" ? "Error" : "Success"}
        </h3>
        {toastState.messages.map((message, index) => (
          <div
            className="w-full flex justify-center items-start gap-2"
            key={index}
          >
            <p className="font-bold">*</p>
            <p className="w-full text-xs">{message}</p>
          </div>
        ))}
      </div>
    );
  }
};

const Button = (props: ButtonProps) => {
  const { onClick, text, useMarginTop, marginTop, color } = props;

  return (
    <button
      className={`w-full p-1 text-sm ${color === "primary" ? "text-text bg-primary/80 hover:bg-primary" : "text-primary bg-text/80 hover:bg-text"} rounded-md cursor-pointer hover:font-semibold`}
      onClick={onClick}
      style={{
        ...(useMarginTop && {
          marginTop: marginTop || "24px",
        }),
      }}
    >
      {text || "Submit"}
    </button>
  );
};

const Form = (props: FormProps) => {
  const { onSubmit, children } = props;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit();
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4 justify-center items-center"
    >
      {children}
    </form>
  );
};

Form.TextArea = TextArea;
Form.File = File;
Form.Input = Input;
Form.Toast = Toast;
Form.Button = Button;

export default Form;
