import loadingImg from '../img/loading.gif';


export const LoadingPage = () => {
  return <div
    className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden font-['Comic_Helvetic']`}>
    <img src={loadingImg} alt="loading"
         height={'140px'}
         width={'140px'}
    />
  </div>;
};
