
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Classifications from "./pages/Classifications";
import DocumentReview from "./pages/DocumentReview";
import DocumentList from "./pages/DocumentList";
import DocumentReviewList from "./pages/DocumentReviewList";
import Validation from "./pages/Validation";
import ValidationList from "./pages/ValidationList";
import ShipmentDetails from "./pages/ShipmentDetails";
import ShipmentList from "./pages/ShipmentList";
import ApprovalSubmit from "./pages/ApprovalSubmit";
import ApprovalSubmitList from "./pages/ApprovalSubmitList";
import NotFound from "./pages/NotFound";
import DeleteData from "./pages/DeleteData";
import Task from "./pages/newcss/taskpage";
import Landing from "./pages/newcss/landing";
import ActionRailSwitch from "./pages/newcss/components/actionrailswitch";
import ProductPage from "./pages/newcss/productpage";
import Test from "./pages/newcss/components/test";
import DocumentPage from "./pages/newcss/documentpage";


  
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/classifications" element={<Classifications />} />
          <Route path="/document-review" element={<DocumentReview />} />
          <Route path="/document-list" element={<DocumentList />} />
          <Route path="/document-review-list" element={<DocumentReviewList />} />
          <Route path="/validation" element={<Validation />} />
          <Route path="/validation-list" element={<ValidationList />} />
          <Route path="/shipment-details" element={<ShipmentDetails />} />
          <Route path="/shipment-list" element={<ShipmentList />} />
          <Route path="/approval-submit" element={<ApprovalSubmit />} />
          <Route path="/approval-submit-list" element={<ApprovalSubmitList />} />
          <Route path="/delete_data" element={<DeleteData />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/task" element={<Task />} />
          <Route path="/actionrail" element={<ActionRailSwitch />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/document" element={<DocumentPage />} />






          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
