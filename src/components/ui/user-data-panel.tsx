"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./select";
import { Edit, Check, X } from "lucide-react";

interface UserData {
  desired_pension_amount: number;
  age: number;
  gender: string;
  current_salary: number;
  desired_pension_amount: number;
  konto_zus: number;
  subkonto_zus: number;
}

interface UserDataPanelProps {
  userData: UserData;
  onUserDataChange: (userData: UserData) => void;
  kodPocztowy: string;
  onKodPocztowyChange: (kodPocztowy: string) => void;
}

export const UserDataPanel = ({ userData, onUserDataChange, kodPocztowy, onKodPocztowyChange }: UserDataPanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData>(userData);

  const handleSave = () => {
    onUserDataChange(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const updateField = (field: keyof UserData, value: any) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full rounded-2xl p-6 bg-white shadow-2x mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-[24px]">Dane użytkownika</h2>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edytuj
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              size="sm"
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Zapisz
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Anuluj
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wiek
          </label>
          {isEditing ? (
            <Input
              type="number"
              value={editedData.age}
              onChange={(e) => updateField('age', parseInt(e.target.value))}
              min={16}
              max={100}
            />
          ) : (
            <div className="text-lg font-semibold">{userData.age} lat</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Płeć
          </label>
          {isEditing ? (
            <Select 
              value={editedData.gender} 
              onValueChange={(value) => updateField('gender', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Mężczyzna</SelectItem>
                <SelectItem value="female">Kobieta</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="text-lg font-semibold">
              {userData.gender === "male" ? "Mężczyzna" : "Kobieta"}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wynagrodzenie brutto
          </label>
          {isEditing ? (
            <Input
              type="number"
              value={editedData.current_salary}
              onChange={(e) => updateField('current_salary', parseFloat(e.target.value))}
              min={0}
            />
          ) : (
            <div className="text-lg font-semibold">{userData.current_salary.toLocaleString()} PLN</div>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pożądana kwota emerytury
          </label>
          {isEditing ? (
            <Input
              type="number"
              value={editedData.desired_pension_amount}
              onChange={(e) => updateField('desired_pension_amount', parseInt(e.target.value))}
              min={0}
            />
          ) : (
            <div className="text-lg font-semibold">{userData.desired_pension_amount.toLocaleString()} PLN</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konto ZUS
          </label>
          {isEditing ? (
            <Input
              type="number"
              value={editedData.konto_zus}
              onChange={(e) => updateField('konto_zus', parseFloat(e.target.value))}
              min={0}
            />
          ) : (
            <div className="text-lg font-semibold">{userData.konto_zus.toLocaleString()} PLN</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subkonto ZUS
          </label>
          {isEditing ? (
            <Input
              type="number"
              value={editedData.subkonto_zus}
              onChange={(e) => updateField('subkonto_zus', parseFloat(e.target.value))}
              min={0}
            />
          ) : (
            <div className="text-lg font-semibold">{userData.subkonto_zus.toLocaleString()} PLN</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kod pocztowy
          </label>
          {isEditing ? (
            <Input
              type="text"
              value={kodPocztowy}
              onChange={(e) => onKodPocztowyChange(e.target.value)}
              placeholder="00-000"
            />
          ) : (
            <div className="text-lg font-semibold">{kodPocztowy}</div>
          )}
        </div>
      </div>
    </div>
  );
};