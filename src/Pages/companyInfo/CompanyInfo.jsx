
import React, { useEffect, useState } from 'react';
import { FaPen, FaPhone, FaTelegram, FaSave, FaTimes, FaInfoCircle } from "react-icons/fa";
import { MdMarkEmailUnread, MdPlace, MdAccessTime } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";

const CompanyInfo = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    telegram: '',
    workTime: '',
    description: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const token = localStorage.getItem("token");

  const GetCompanyInfo = async () => {
    try {
      setIsLoading(true);
      const request = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/company-info`);
      const response = await request.json();
      setCompanyInfo(response);
      setFormData({
        email: response.email?.[0] || '',
        phone: response.phoneNumbers?.[0] || '',
        address: response.companyAddress?.address || '',
        telegram: response.telegram || '',
        workTime: response.workTime || '',
        description: response.companyInfo || ''
      });
    } catch (error) {
      console.log("Ошибка получения данных", error);
      showNotification('Ошибка при получении информации о компании', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/company-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: [formData.email],
          phoneNumbers: [formData.phone],
          companyAddress: { address: formData.address },
          telegram: formData.telegram,
          workTime: formData.workTime,
          companyInfo: formData.description
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        setCompanyInfo(updatedData);
        setEditMode(false);
        showNotification('Информация о компании успешно обновлена!', 'success');
      } else {
        console.error('Не удалось обновить информацию о компании');
        showNotification('Не удалось обновить информацию о компании', 'error');
      }
    } catch (error) {
      console.error('Ошибка обновления информации о компании:', error);
      showNotification('Ошибка обновления информации о компании', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    GetCompanyInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 md:p-8 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-base-content'>Информация о компании</h1>
            <p className='text-base-content/70 mt-2'>Управляйте контактными данными и информацией о вашей компании</p>
          </div>
          {!editMode && (
            <button
              className='btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all'
              onClick={() => setEditMode(true)}
            >
              <FaPen className="text-sm" /> Редактировать информацию
            </button>
          )}
        </div>

        {notification.show && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            notification.type === 'success' 
              ? 'bg-success/10 border-success text-success' 
              : 'bg-error/10 border-error text-error'
          }`}>
            <div className="flex items-center">
              <FaInfoCircle className="mr-2" />
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="bg-base-100 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-base-content/70">Загрузка информации о компании...</p>
          </div>
        )}

        {!isLoading && companyInfo && !editMode && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden border border-base-300">
              <div className="bg-gradient-to-r from-primary to-primary-focus p-6">
                <p className="text-xl font-bold text-primary-content">Контактные данные</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                      <MdMarkEmailUnread className='text-xl' />
                    </div>
                    <div>
                      <p className="font-semibold text-base-content/70">Электронная почта</p>
                      <p className="text-lg text-base-content">{companyInfo.email?.[0] || 'Не указано'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary/10 p-3 rounded-full text-secondary">
                      <FaPhone className='text-xl' />
                    </div>
                    <div>
                      <p className="font-semibold text-base-content/70">Телефон</p>
                      <p className="text-lg text-base-content">{companyInfo.phoneNumbers?.[0] || 'Не указано'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-full text-accent">
                      <MdPlace className='text-xl' />
                    </div>
                    <div>
                      <p className="font-semibold text-base-content/70">Адрес</p>
                      <p className="text-lg text-base-content">{companyInfo.companyAddress?.address || 'Не указано'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-info/10 p-3 rounded-full text-info">
                      <FaTelegram className='text-xl' />
                    </div>
                    <div>
                      <p className="font-semibold text-base-content/70">Telegram</p>
                      <p className="text-lg text-base-content">{companyInfo.telegram || 'Не указано'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-warning/10 p-3 rounded-full text-warning">
                      <MdAccessTime className='text-xl' />
                    </div>
                    <div>
                      <p className="font-semibold text-base-content/70">Рабочее время</p>
                      <p className="text-lg text-base-content">{companyInfo.workTime || 'Не указано'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden border border-base-300">
              <div className="bg-gradient-to-r from-primary to-primary-focus p-6">
                <h2 className="text-xl font-bold text-secondary-content">Описание компании</h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 p-3 rounded-full text-secondary">
                    <TbFileDescription className='text-xl' />
                  </div>
                  <div>
                    <p className="text-base-content leading-relaxed">
                      {companyInfo.companyInfo || 'Описание компании отсутствует.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !editMode && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-r from-primary to-primary-focus rounded-xl shadow-lg p-6 text-primary-content">
              <div className="text-3xl font-bold mb-2">5+</div>
              <div className="text-lg">Лет в бизнесе</div>
              <div className="text-sm opacity-80 mt-1">Доверяют клиенты</div>
            </div>
            
            <div className="bg-gradient-to-r from-secondary to-secondary-focus rounded-xl shadow-lg p-6 text-secondary-content">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-lg">Поддержка клиентов</div>
              <div className="text-sm opacity-80 mt-1">Всегда готовы помочь</div>
            </div>
            
            <div className="bg-gradient-to-r from-accent to-accent-focus rounded-xl shadow-lg p-6 text-accent-content">
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-lg">Сотрудников</div>
              <div className="text-sm opacity-80 mt-1">Преданные профессионалы</div>
            </div>
          </div>
        )}

        {editMode && (
          <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300">
            <div className="bg-gradient-to-r from-primary to-primary-focus p-6">
              <h2 className="text-xl font-bold text-primary-content">Редактировать информацию о компании</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2 text-base-content">
                        <MdMarkEmailUnread className='text-primary' /> Электронная почта
                      </span>
                    </label>
                    <input 
                      type="text" 
                      name="email"
                      className="input input-bordered w-full focus:ring-2 focus:ring-primary" 
                      placeholder="Электронная почта компании..." 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2 text-base-content">
                        <FaPhone className='text-secondary' /> Телефон
                      </span>
                    </label>
                    <input 
                      type="text" 
                      name="phone"
                      className="input input-bordered w-full focus:ring-2 focus:ring-secondary" 
                      placeholder="Номер телефона..." 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2 text-base-content">
                        <MdPlace className='text-accent' /> Адрес
                      </span>
                    </label>
                    <textarea 
                      name="address"
                      className="textarea textarea-bordered w-full focus:ring-2 focus:ring-accent" 
                      placeholder="Адрес компании..." 
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2 text-base-content">
                        <FaTelegram className='text-info' /> Telegram
                      </span>
                    </label>
                    <input 
                      type="text" 
                      name="telegram"
                      className="input input-bordered w-full focus:ring-2 focus:ring-info" 
                      placeholder="Ссылка на Telegram..." 
                      value={formData.telegram}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2 text-base-content">
                        <MdAccessTime className='text-warning' /> Рабочее время
                      </span>
                    </label>
                    <input 
                      type="text" 
                      name="workTime"
                      className="input input-bordered w-full focus:ring-2 focus:ring-warning" 
                      placeholder="например, 9:00 - 18:00" 
                      value={formData.workTime}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2 text-base-content">
                        <TbFileDescription className='text-secondary' /> Описание
                      </span>
                    </label>
                    <textarea 
                      name="description"
                      className="textarea textarea-bordered w-full focus:ring-2 focus:ring-secondary h-32" 
                      placeholder="Описание компании..." 
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-base-300">
                <button 
                  className="btn btn-outline btn-error flex items-center gap-2"
                  onClick={() => setEditMode(false)}
                  disabled={isSaving}
                >
                  <FaTimes /> Отмена
                </button>
                <button 
                  className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg"
                  onClick={handleSubmit}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner"></span> Сохранение...
                    </>
                  ) : (
                    <>
                      <FaSave /> Сохранить изменения
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInfo;