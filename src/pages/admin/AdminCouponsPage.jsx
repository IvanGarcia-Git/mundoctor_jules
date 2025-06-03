import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox'; // For applicable plans
import {
  Search, PlusCircle, Trash2, Edit3, CheckCircle, XCircle, Tag, CalendarDays, Users, Percent, Gift, AlertTriangle
} from 'lucide-react';

// TODO: API Call - Replace with actual data fetching.
const initialCoupons = [
  // Dates are YYYY-MM-DD. usageLimit: Infinity for unlimited.
  { id: 'coup_001', code: 'WELCOME2024', status: 'Active', description: "20% de descuento en la primera suscripción.", conditions: "Aplicable solo a nuevos usuarios para el plan Premium o Enterprise. No acumulable.", discountType: 'percentage', discountValue: 20, applicablePlans: ['Premium', 'Enterprise'], validFrom: '2024-01-01', validTo: '2024-06-30', usesMade: 15, usageLimit: 100 },
  { id: 'coup_002', code: 'SUMMERSALE', status: 'Active', description: "1 Mes Gratis en plan Básico.", conditions: "Válido para todos los usuarios. No requiere compra mínima.", discountType: 'free_months', discountValue: 1, applicablePlans: ['Básico'], validFrom: '2024-07-01', validTo: '2024-07-31', usesMade: 50, usageLimit: Infinity },
  { id: 'coup_003', code: 'EXPIRED23', status: 'Inactive', description: "10% descuento en todos los planes.", conditions: "Cupón expirado.", discountType: 'percentage', discountValue: 10, applicablePlans: ['Todos'], validFrom: '2023-12-01', validTo: '2023-12-31', usesMade: 25, usageLimit: 25 },
  { id: 'coup_004', code: 'PROLAUNCH', status: 'Active', description: "3 Meses Gratis en plan Enterprise.", conditions: "Solo para profesionales verificados. Lanzamiento.", discountType: 'free_months', discountValue: 3, applicablePlans: ['Enterprise'], validFrom: '2024-03-01', validTo: '2024-04-30', usesMade: 5, usageLimit: 20 },
];

const ALL_PLANS = ['Básico', 'Premium', 'Enterprise'];

const CouponStatusBadge = ({ status }) => { // Specific for Coupon Active/Inactive
  const isActive = status === 'Active';
  const icon = isActive ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />;
  // Ensuring consistent border usage with other status badges
  const className = `font-medium border ${isActive
    ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-700/50"
    : "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-700/50"}`;
  return <Badge className={className}>{icon}{status}</Badge>;
};

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponFormData, setCouponFormData] = useState({});

  const filteredCoupons = useMemo(() => coupons.filter(coupon => {
    const searchLower = searchTerm.toLowerCase();
    return coupon.code.toLowerCase().includes(searchLower) || coupon.description.toLowerCase().includes(searchLower);
  }), [coupons, searchTerm]);

  const openModalForCreate = () => {
    setEditingCoupon(null);
    setCouponFormData({
      code: '', description: '', conditions: '', discountType: 'percentage', discountValue: 0,
      applicablePlans: [], validFrom: '', validTo: '', usageLimit: 0, status: 'Active'
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (coupon) => {
    setEditingCoupon(coupon);
    setCouponFormData({ ...coupon, usageLimit: coupon.usageLimit === Infinity ? 0 : coupon.usageLimit }); // 0 for unlimited in form
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "applicablePlans") {
      const planValue = value;
      if (planValue === "Todos") {
        setCouponFormData(prev => ({ ...prev, applicablePlans: prev.applicablePlans.includes("Todos") ? [] : ["Todos"] }));
      } else {
        setCouponFormData(prev => ({
          ...prev,
          applicablePlans: checked ? [...prev.applicablePlans.filter(p => p !== "Todos"), planValue] : prev.applicablePlans.filter(p => p !== planValue)
        }));
      }
    } else {
      setCouponFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSwitchChange = (name, checked) => {
     setCouponFormData(prev => ({ ...prev, [name]: checked ? 'Active' : 'Inactive' }));
  };

  const handleSelectChange = (name, value) => {
    setCouponFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSaveCoupon = () => {
    // TODO: Add form validation (e.g., dates, discount value, code uniqueness if API requires)
    const dataToSave = {
      ...couponFormData,
      discountValue: parseFloat(couponFormData.discountValue) || 0,
      usageLimit: parseFloat(couponFormData.usageLimit) === 0 ? Infinity : parseFloat(couponFormData.usageLimit), // 0 in form means Infinity
      applicablePlans: (couponFormData.applicablePlans || []).includes("Todos") ? ["Todos"] : (couponFormData.applicablePlans || []).filter(p => ALL_PLANS.includes(p)),
      status: couponFormData.status || 'Inactive', // Default to Inactive if not set
    };

    if (editingCoupon) {
      // TODO: Implement API call to PUT/PATCH updated coupon data.
      setCoupons(coupons.map(c => c.id === editingCoupon.id ? { ...editingCoupon, ...dataToSave } : c));
      console.warn("API Call Placeholder: Update coupon - ", editingCoupon.id, dataToSave);
    } else {
      // TODO: Implement API call to POST new coupon data.
      const newCoupon = {
        id: `coup_${String(Date.now()).slice(-3)}${String(Math.floor(Math.random()*100)).padStart(2,'0')}`, // Client-gen ID, API should generate
        usesMade: 0,
        ...dataToSave,
      };
      setCoupons([newCoupon, ...coupons]);
      console.warn("API Call Placeholder: Create new coupon - ", newCoupon);
    }
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (couponId) => {
    // TODO: Implement API call to DELETE coupon.
    setCoupons(coupons.filter(c => c.id !== couponId));
    console.warn("API Call Placeholder: Delete coupon - ", couponId);
  };

  const getDiscountDisplay = (type, value) => {
    if (type === 'percentage') return `${value}% Dto.`;
    if (type === 'free_months') return `${value} Mes${value > 1 ? 'es' : ''} Gratis`;
    return String(value);
  };

  return (
    <div className="bg-background dark:bg-slate-900 text-foreground dark:text-white min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestión de Cupones</h1>
            <p className="text-muted-foreground dark:text-gray-400">Crea y administra los cupones de descuento de la plataforma.</p>
          </div>
          <Button onClick={openModalForCreate} className="bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
            <PlusCircle className="mr-2 h-5 w-5" /> Crear Cupón
          </Button>
        </header>

        <div className="mb-6 p-4 bg-card dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-border dark:border-gray-700/50 shadow-md">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por código o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background dark:bg-gray-900/70 border-border dark:border-gray-700 focus:ring-primary dark:focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Coupons Grid */}
        {/* Coupons Grid */}
        {coupons.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground dark:text-gray-400">No hay cupones creados todavía.</p>
        ) : filteredCoupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map(coupon => (
              // TODO: Review card layout for optimal information hierarchy and space usage on small screens.
              <div key={coupon.id} className="bg-card dark:bg-gray-800/80 backdrop-blur-sm p-5 rounded-xl border border-border dark:border-gray-700/60 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-primary dark:text-blue-400 flex items-center break-all"><Tag className="mr-2 h-5 w-5 flex-shrink-0"/>{coupon.code}</h2>
                    <CouponStatusBadge status={coupon.status} />
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-gray-300 mb-1 line-clamp-2" title={coupon.description}>{coupon.description || "Sin descripción"}</p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400 mb-3 line-clamp-2" title={coupon.conditions}>Condiciones: {coupon.conditions || "Sin condiciones específicas"}</p>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center">
                      {coupon.discountType === 'percentage' ? <Percent className="h-4 w-4 mr-2 text-green-500 flex-shrink-0"/> : <Gift className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0"/>}
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{getDiscountDisplay(coupon.discountType, coupon.discountValue)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0"/>
                      <span className="text-gray-700 dark:text-gray-300">Planes: {(coupon.applicablePlans || []).join(', ')}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0"/>
                      <span className="text-gray-700 dark:text-gray-300">Del {coupon.validFrom || "N/A"} al {coupon.validTo || "N/A"}</span>
                    </div>
                     <div className="flex items-center">
                       <Tag className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                       <span className="text-gray-700 dark:text-gray-300">Usos: {coupon.usesMade} / {coupon.usageLimit === Infinity ? 'Ilimitados' : coupon.usageLimit}</span> {/* Changed to Ilimitados */}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-auto pt-3 border-t border-border dark:border-gray-700/50">
                  <Button variant="ghost" size="sm" onClick={() => openModalForEdit(coupon)} className="text-primary dark:text-blue-400 hover:bg-primary/10 dark:hover:bg-blue-400/10">
                    <Edit3 className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10">
                        <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 text-foreground dark:text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg text-gray-800 dark:text-white flex items-center"><AlertTriangle className="mr-2 text-red-500"/>Confirmar Eliminación</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground dark:text-gray-400">
                          ¿Estás seguro de que quieres eliminar el cupón <span className="font-semibold">{coupon.code}</span>? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="dark:text-gray-300 dark:border-gray-600 hover:dark:bg-gray-700">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCoupon(coupon.id)} className="bg-red-600 hover:bg-red-700 text-white">Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <p className="text-center py-10 text-muted-foreground dark:text-gray-400">No se encontraron cupones con los criterios seleccionados.</p>
        )}

        {/* Create/Edit Coupon Modal */}
        <Dialog open={isModalOpen} onOpenChange={(isOpen) => { setIsModalOpen(isOpen); if (!isOpen) setEditingCoupon(null); }}>
          <DialogContent className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 text-foreground dark:text-white sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-800 dark:text-white">{editingCoupon ? 'Editar Cupón' : 'Crear Nuevo Cupón'}</DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-gray-400">
                {editingCoupon ? 'Modifica los detalles del cupón.' : 'Completa los detalles para crear un nuevo cupón. Todos los campos son opcionales excepto el código.'}
              </DialogDescription>
            </DialogHeader>
            {/* TODO: Implement more robust form validation (e.g., using Zod and react-hook-form) */}
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4 pl-1"> {/* Added pr-4 pl-1 for scrollbar spacing */}
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                <Label htmlFor="code" className="text-right col-span-4 sm:col-span-1 dark:text-gray-300">Código <span className="text-red-500">*</span></Label>
                <Input id="code" name="code" value={couponFormData.code || ''} onChange={handleFormChange} className="col-span-4 sm:col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700" required />
              </div>
              <div className="grid grid-cols-4 items-start gap-x-4 gap-y-2">
                <Label htmlFor="description" className="text-right col-span-4 sm:col-span-1 pt-2 dark:text-gray-300">Descripción</Label>
                <Textarea id="description" name="description" value={couponFormData.description || ''} onChange={handleFormChange} className="col-span-4 sm:col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700" />
              </div>
              <div className="grid grid-cols-4 items-start gap-x-4 gap-y-2">
                <Label htmlFor="conditions" className="text-right col-span-4 sm:col-span-1 pt-2 dark:text-gray-300">Condiciones</Label>
                <Textarea id="conditions" name="conditions" value={couponFormData.conditions || ''} onChange={handleFormChange} className="col-span-4 sm:col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700" />
              </div>
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                <Label htmlFor="discountType" className="text-right col-span-4 sm:col-span-1 dark:text-gray-300">Tipo Descuento</Label>
                <Select name="discountType" value={couponFormData.discountType || 'percentage'} onValueChange={(value) => handleSelectChange('discountType', value)}>
                  <SelectTrigger className="col-span-4 sm:col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-background dark:bg-gray-800 text-foreground dark:text-white">
                    <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                    <SelectItem value="free_months">Meses Gratis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                <Label htmlFor="discountValue" className="text-right col-span-4 sm:col-span-1 dark:text-gray-300">Valor Descuento</Label>
                <Input id="discountValue" name="discountValue" type="number" min="0" value={couponFormData.discountValue || 0} onChange={handleFormChange} className="col-span-4 sm:col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700" />
              </div>
              <div className="grid grid-cols-4 items-start gap-x-4 gap-y-2">
                <Label className="text-right col-span-4 sm:col-span-1 pt-2 dark:text-gray-300">Planes Aplicables</Label>
                <div className="col-span-4 sm:col-span-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="plan-todos" name="applicablePlans" value="Todos" checked={(couponFormData.applicablePlans || []).includes("Todos")} onCheckedChange={(checked) => handleFormChange({target: {name: "applicablePlans", value: "Todos", type: "checkbox", checked}})} />
                    <Label htmlFor="plan-todos" className="font-normal dark:text-gray-300">Todos los Planes</Label>
                  </div>
                  {ALL_PLANS.map(plan => (
                    <div key={plan} className="flex items-center space-x-2">
                      <Checkbox id={`plan-${plan}`} name="applicablePlans" value={plan} checked={!(couponFormData.applicablePlans || []).includes("Todos") && (couponFormData.applicablePlans || []).includes(plan)} onCheckedChange={(checked) => handleFormChange({target: {name: "applicablePlans", value: plan, type: "checkbox", checked}})} disabled={(couponFormData.applicablePlans || []).includes("Todos")} />
                      <Label htmlFor={`plan-${plan}`} className="font-normal dark:text-gray-300">{plan}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                <Label htmlFor="validFrom" className="text-right col-span-4 sm:col-span-1 dark:text-gray-300">Válido Desde</Label>
                <Input id="validFrom" name="validFrom" type="date" value={couponFormData.validFrom || ''} onChange={handleFormChange} className="col-span-4 sm:col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700 dark:[color-scheme:dark]" />
              </div>
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                <Label htmlFor="validTo" className="text-right col-span-4 sm:col-span-1 dark:text-gray-300">Válido Hasta</Label>
                <Input id="validTo" name="validTo" type="date" value={couponFormData.validTo || ''} onChange={handleFormChange} className="col-span-4 sm:col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700 dark:[color-scheme:dark]" />
              </div>
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                <Label htmlFor="usageLimit" className="text-right col-span-4 sm:col-span-1 dark:text-gray-300">Límite de Usos</Label>
                <Input id="usageLimit" name="usageLimit" type="number" min="0" value={couponFormData.usageLimit === Infinity ? 0 : couponFormData.usageLimit || 0} onChange={handleFormChange} placeholder="0 para ilimitado" className="col-span-4 sm:col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700" />
              </div>
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                <Label htmlFor="status" className="text-right col-span-4 sm:col-span-1 dark:text-gray-300">Estado</Label>
                <div className="col-span-4 sm:col-span-3 flex items-center">
                  <Switch id="status" name="status" checked={couponFormData.status === 'Active'} onCheckedChange={(checked) => handleSwitchChange('status', checked)} /> {/* Fixed: pass name to handleSwitchChange */}
                  <span className="ml-2 text-sm dark:text-gray-300">{couponFormData.status === 'Active' ? 'Activo' : 'Inactivo'}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline" className="dark:text-gray-300 dark:border-gray-600 hover:dark:bg-gray-700">Cancelar</Button></DialogClose>
              <Button onClick={handleSaveCoupon} className="bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">Guardar Cupón</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminCouponsPage;
