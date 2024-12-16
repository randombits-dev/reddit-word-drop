import loadingImg from '../img/logo.png';


export const LoadingPage = () => {
  return <div
    className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden font-['Comic_Helvetic']`}>
    <img src={loadingImg} alt="loading" className="animate-[bounce_0.5s_ease-in-out_infinite]"
         width="100" height="100" />
  </div>;
};
