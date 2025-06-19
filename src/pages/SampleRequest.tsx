import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/PageHeader';
import {
  Package,
  Calendar,
  MapPin,
  Building2,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  FileText,
  Download,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

interface SampleRequest {
  id: string;
  materialId: string;
  materialName: string;
  supplier: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'rejected';
  quantity: number;
  notes: string;
  urgency: 'low' | 'medium' | 'high';
  shippingAddress: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  feedback?: string;
  rating?: number;
}

const SampleRequest: React.FC = () => {
  const [requests, setRequests] = useState<SampleRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock data
  useEffect(() => {
    const mockRequests: SampleRequest[] = [
      {
        id: '1',
        materialId: 'mat-001',
        materialName: 'Organic Cotton Twill',
        supplier: 'EcoTextiles Ltd',
        requestDate: '2023-06-15',
        status: 'delivered',
        quantity: 2,
        notes: 'Need samples for upcoming collection review',
        urgency: 'medium',
        shippingAddress: {
          name: 'John Smith',
          company: 'Fashion Forward Inc',
          address: '123 Design St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2023-06-20',
        actualDelivery: '2023-06-19',
        feedback: 'Great quality, perfect for our needs',
        rating: 5
      },
      // Add more mock requests...
    ];
    
    setRequests(mockRequests);
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesSearch = request.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: SampleRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: SampleRequest['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Sample Requests" 
          description="Track and manage your material sample requests"
          icon={<Package className="w-8 h-8" />}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {requests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shipped</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {requests.filter(r => r.status === 'shipped').length}
                  </p>
                </div>
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">
                    {requests.filter(r => r.status === 'delivered').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by material or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="status">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Request Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.materialName}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {request.supplier}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Request Date</p>
                        <p className="text-gray-900 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Quantity</p>
                        <p className="text-gray-900 flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {request.quantity} samples
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Urgency</p>
                        <Badge variant={request.urgency === 'high' ? 'destructive' : request.urgency === 'medium' ? 'default' : 'secondary'}>
                          {request.urgency}
                        </Badge>
                      </div>
                    </div>

                    {request.notes && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-1">Notes</p>
                        <p className="text-gray-700 text-sm">{request.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Shipping & Tracking */}
                  <div className="lg:w-80 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{request.shippingAddress.name}</p>
                        <p>{request.shippingAddress.company}</p>
                        <p>{request.shippingAddress.address}</p>
                        <p>{request.shippingAddress.city}, {request.shippingAddress.state} {request.shippingAddress.zipCode}</p>
                        <p>{request.shippingAddress.country}</p>
                      </div>
                    </div>

                    {request.trackingNumber && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tracking</h4>
                        <p className="text-sm text-gray-600 mb-1">Tracking Number: {request.trackingNumber}</p>
                        {request.estimatedDelivery && (
                          <p className="text-sm text-gray-600">
                            Est. Delivery: {new Date(request.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                        {request.actualDelivery && (
                          <p className="text-sm text-green-600 font-medium">
                            Delivered: {new Date(request.actualDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Feedback Section */}
                {request.feedback && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
                      <p className="text-sm text-gray-700 mb-2">{request.feedback}</p>
                      {request.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 ${
                                i < request.rating! ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </div>
                          ))}
                          <span className="text-sm text-gray-600 ml-2">({request.rating}/5)</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sample requests found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by requesting your first material sample.'}
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Request Sample
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SampleRequest;
