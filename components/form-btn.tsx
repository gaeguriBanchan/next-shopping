interface IFormBtnProps {
  loading: boolean;
  text: string;
}

export default function FormBtn({ loading, text }: IFormBtnProps) {
  return (
    <button
      disabled={loading}
      className="primary-btn h-10 disabled:bg-gray-400 disabled:text-gray-300 disabled:cursor-not-allowed"
    >
      {loading ? 'Loading...' : text}
    </button>
  );
}
