import Sidebar from '../components/Sidebar';

function MainLayout({ children }: any) {

  return (

    <div className="container">

      <Sidebar />

      <div className="content">

        {children}

      </div>

    </div>
  );
}

export default MainLayout;