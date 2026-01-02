import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './Layout';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import History from './pages/History';
import Insights from './pages/Insights';
import Pricing from './pages/Pricing';
import Payment from './pages/Payment';
import Contact from './pages/Contact';
import QueryDetail from './pages/QueryDetail';

const queryClient = new QueryClient();

function PageWrapper({ children, pageName }) {
  return <Layout currentPageName={pageName}>{children}</Layout>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<PageWrapper pageName="Home"><Home /></PageWrapper>} />
          <Route path="/home" element={<PageWrapper pageName="Home"><Home /></PageWrapper>} />
          <Route path="/analyze" element={<PageWrapper pageName="Analyze"><Analyze /></PageWrapper>} />
          <Route path="/history" element={<PageWrapper pageName="History"><History /></PageWrapper>} />
          <Route path="/insights" element={<PageWrapper pageName="Insights"><Insights /></PageWrapper>} />
          <Route path="/pricing" element={<PageWrapper pageName="Pricing"><Pricing /></PageWrapper>} />
          <Route path="/payment" element={<PageWrapper pageName="Pricing"><Payment /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper pageName="Contact"><Contact /></PageWrapper>} />
          <Route path="/querydetail" element={<PageWrapper pageName="Analyze"><QueryDetail /></PageWrapper>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
