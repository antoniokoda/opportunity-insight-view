
import React, { useState } from 'react';
import { Plus, Edit, Trash2, User, Mail, Phone, Linkedin, Briefcase } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useOpportunityContacts, OpportunityContact } from '@/hooks/useOpportunityContacts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OpportunityContactsDialogProps {
  opportunityId: number;
  opportunityName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ContactFormData {
  name: string;
  position: string;
  email: string;
  phone: string;
  linkedin_url: string;
}

export const OpportunityContactsDialog: React.FC<OpportunityContactsDialogProps> = ({
  opportunityId,
  opportunityName,
  isOpen,
  onClose,
}) => {
  const { contacts, isLoading, addContact, updateContact, deleteContact } = useOpportunityContacts(opportunityId);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<OpportunityContact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<OpportunityContact | null>(null);
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    position: '',
    email: '',
    phone: '',
    linkedin_url: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      email: '',
      phone: '',
      linkedin_url: '',
    });
  };

  const handleAddContact = () => {
    setShowAddForm(true);
    setEditingContact(null);
    resetForm();
  };

  const handleEditContact = (contact: OpportunityContact) => {
    setEditingContact(contact);
    setShowAddForm(true);
    setFormData({
      name: contact.name,
      position: contact.position || '',
      email: contact.email || '',
      phone: contact.phone || '',
      linkedin_url: contact.linkedin_url || '',
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const contactData = {
      name: formData.name.trim(),
      position: formData.position.trim() || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      linkedin_url: formData.linkedin_url.trim() || undefined,
    };

    if (editingContact) {
      updateContact({ id: editingContact.id, updates: contactData });
    } else {
      addContact(contactData);
    }

    setShowAddForm(false);
    setEditingContact(null);
    resetForm();
  };

  const handleDeleteContact = (contact: OpportunityContact) => {
    setDeleteConfirm(contact);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteContact(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contactos - {opportunityName}</DialogTitle>
            <DialogDescription>
              Cargando contactos...
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <div className="animate-pulse space-y-4 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Contactos - {opportunityName}
            </DialogTitle>
            <DialogDescription>
              Gestiona los contactos relacionados con esta oportunidad
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add Contact Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitForm} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Nombre completo"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="position">Cargo</Label>
                        <Input
                          id="position"
                          value={formData.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          placeholder="Cargo o posición"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="email@ejemplo.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1234567890"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={formData.linkedin_url}
                          onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                          placeholder="https://linkedin.com/in/usuario"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button type="submit">
                        {editingContact ? 'Actualizar' : 'Agregar'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingContact(null);
                          resetForm();
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Add Contact Button */}
            {!showAddForm && (
              <Button onClick={handleAddContact} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Contacto
              </Button>
            )}

            {/* Contacts List */}
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay contactos registrados para esta oportunidad</p>
                  {!showAddForm && (
                    <Button variant="outline" onClick={handleAddContact} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar primer contacto
                    </Button>
                  )}
                </div>
              ) : (
                contacts.map((contact) => (
                  <Card key={contact.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{contact.name}</h3>
                            {contact.position && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                {contact.position}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {contact.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                <a href={`mailto:${contact.email}`} className="hover:text-primary">
                                  {contact.email}
                                </a>
                              </div>
                            )}
                            
                            {contact.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                <a href={`tel:${contact.phone}`} className="hover:text-primary">
                                  {contact.phone}
                                </a>
                              </div>
                            )}
                            
                            {contact.linkedin_url && (
                              <div className="flex items-center gap-1">
                                <Linkedin className="w-4 h-4" />
                                <a 
                                  href={contact.linkedin_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:text-primary"
                                >
                                  LinkedIn
                                </a>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Creado: {format(new Date(contact.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditContact(contact)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar contacto</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteContact(contact)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Eliminar contacto</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar el contacto "{deleteConfirm?.name}"? 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};
