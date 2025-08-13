interface LoadingSpinnerProps {
  msg: string;
}

export default function LoadingSpinner({ msg }: LoadingSpinnerProps) {
  return (
    <div className="text-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
      <p className="text-[#13233D]/70">{msg}</p>
    </div>
  );
}
