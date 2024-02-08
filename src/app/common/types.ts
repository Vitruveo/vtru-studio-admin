export interface FormikDefaultProps {
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
    handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export interface ShowModalProps {
    showModal: boolean;
    handleChangeModal: () => void;
}
