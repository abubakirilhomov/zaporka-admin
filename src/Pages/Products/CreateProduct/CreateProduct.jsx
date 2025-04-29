import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BasicInfoSection from "../../../Components/BasicInfoSection/BasicInfoSection";
import ImagesSection from "./ImagesSection/ImagesSection";
import TechnicalSpecsSection from "./TechnicalSpecsSection/TechnicalSpecsSection";
import AdditionalInfoSection from "./AdditionalInfoSection/AdditionalInfoSection";
import { MdOutlinePlaylistAdd } from "react-icons/md";

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm();
  const token = localStorage.getItem("token");
  const mainImage = watch("mainImage");
  const swiperImages = watch("swiperImages") || [];

  const handleSwiperImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB limit per image
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error("Каждое изображение должно быть меньше 5MB");
      return;
    }

    if (files.length > 3 || swiperImages.length + files.length > 3) {
      toast.error("Можно выбрать максимум 3 изображения для слайдера");
      return;
    }

    const newFiles = [...swiperImages, ...files].slice(0, 3);
    setValue("swiperImages", newFiles, { shouldValidate: true });
    trigger("swiperImages");
  };

  const handleCreateProduct = async (data) => {
    try {
      // Проверка токена
      if (!token) {
        throw new Error("Токен авторизации отсутствует. Пожалуйста, войдите в систему.");
      }

      // Валидация обязательных полей
      const requiredFields = ["title", "mainImage", "price", "currency"];
      const missingFields = requiredFields.filter((field) => {
        if (field === "mainImage") {
          return (
            !data.mainImage ||
            (Array.isArray(data.mainImage) && data.mainImage.length === 0) ||
            (data.mainImage instanceof FileList && data.mainImage.length === 0)
          );
        }
        return !data[field] || (Array.isArray(data[field]) && data[field].length === 0);
      });

      if (missingFields.length > 0) {
        throw new Error(`Заполните обязательные поля: ${missingFields.join(", ")}`);
      }

      // Проверка размера главной картинки
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (data.mainImage && data.mainImage instanceof File && data.mainImage.size > maxSize) {
        throw new Error("Главная картинка должна быть меньше 5MB");
      }

      // Подготовка FormData
      const formData = new FormData();

      // Базовые поля
      const basicFields = {
        title: data.title || "High-Pressure Steel Pipes",
        description: data.description || "A durable steel pipe designed for high-pressure industrial applications.",
        stock: data.stock || 2571,
        currency: data.currency || "UZS",
        availabilitiy: data.availabilitiy !== undefined ? data.availabilitiy : true,
        manufacturer: data.manufacturer || "SteelCo",
        model: data.model || "SP-500",
        standart: data.standart || "DIN EN 10255",
        serviceLife: data.serviceLife || "20 years",
        construction: data.construction || "Tubular",
        accession: data.accession || "Flanged",
      };

      Object.entries(basicFields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Поля с массивами
      const arrayFields = {
        price: data.price || [150000, 175000],
        swiperImages: data.swiperImages || [],
        sizeInInch: data.sizeInInch || ["1/2", "3/4"],
        sizeInmm: data.sizeInmm || [15, 20],
        DN: data.DN || [15, 20],
        type: data.type || ["Seamless", "Welded"],
        surfaceMaterial: data.surfaceMaterial || ["Galvanized", "Black Oxide"],
        workEnv: data.workEnv || ["Water", "Gas", "Oil"],
        nominalPressure: data.nominalPressure || ["PN16", "PN25"],
        workingPressure: data.workingPressure || ["10 bar", "15 bar"],
        minPressure: data.minPressure || ["1 bar", "2 bar"],
        maxPressure: data.maxPressure || ["20 bar", "25 bar"],
        application: data.application || ["Plumbing", "Industrial Piping"],
        advantages: data.advantages || ["Corrosion-resistant", "High durability", "Easy installation"],
      };

      // Добавим отладочную информацию
      console.log("arrayFields:", arrayFields);

      Object.entries(arrayFields).forEach(([key, value]) => {
        // Убедимся, что value — это массив
        const arrayValue = Array.isArray(value) ? value : [value];
        if (key === "swiperImages") {
          arrayValue.forEach((file) => formData.append("swiperImages", file));
        } else {
          arrayValue.forEach((item) => formData.append(`${key}[]`, item));
        }
      });

      // Технические характеристики
      const technicalSpecs = {
        thickness: data.thickness || "5mm",
        SDR: data.SDR || 11,
        rotationAngle: data.rotationAngle || "90°",
        material: data.material || "Carbon Steel",
        steelGrade: data.steelGrade || "S235",
        workEnvTemperature: data.workEnvTemperature || "-20°C to 120°C",
      };

      Object.entries(technicalSpecs).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Главная картинка
      if (data.mainImage) {
        if (data.mainImage instanceof FileList) {
          if (data.mainImage.length > 0) {
            formData.append("mainImage", data.mainImage[0]);
          } else {
            throw new Error("Выберите главную картинку");
          }
        } else if (Array.isArray(data.mainImage) && data.mainImage.length > 0) {
          formData.append("mainImage", data.mainImage[0]);
        } else if (data.mainImage instanceof File) {
          formData.append("mainImage", data.mainImage);
        } else {
          throw new Error("Неверный формат главной картинки");
        }
      } else {
        throw new Error("Главная картинка обязательна");
      }

      // Категория (отправляем только _id как строку)
      if (data.category && data.category._id) {
        formData.append("category", data.category._id);
      } else {
        formData.append("category", "67c5de0605ea1bafcf7d16ef");
      }

      // Отправка запроса с увеличенным таймаутом
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 секунд

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 400) {
          const error = await response.json();
          throw new Error(error.message || "Ошибка валидации данных");
        } else if (response.status === 403) {
          throw new Error("Доступ запрещен: проверьте токен авторизации или права доступа.");
        } else if (response.status === 520) {
          throw new Error("Ошибка сервера: попробуйте позже или обратитесь к администратору.");
        }
        const error = await response.json();
        throw new Error(error.message || "Ошибка при создании продукта");
      }

      toast.success("Продукт успешно создан");
    } catch (error) {
      console.error("Ошибка при создании продукта:", error);
      if (error.name === "AbortError") {
        toast.error("Запрос превысил время ожидания. Проверьте сервер или уменьшите размер файлов.");
      } else if (error.message.includes("Failed to fetch")) {
        toast.error(
          "Не удалось подключиться к серверу. Проверьте CORS, доступность сервера или подключение к интернету."
        );
      } else {
        toast.error(`Не удалось создать продукт: ${error.message}`);
      }
    }
  };

  return (
    <div className="max-w-[90%] mx-auto p-4 bg-base-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MdOutlinePlaylistAdd className="text-3xl text-base-content" />
        Создать новый продукт
      </h2>

      <form onSubmit={handleSubmit(handleCreateProduct)} className="space-y-6">
        <BasicInfoSection register={register} errors={errors} />
        <ImagesSection
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          onSwiperImagesChange={handleSwiperImagesChange}
        />
        <TechnicalSpecsSection register={register} errors={errors} />
        <AdditionalInfoSection register={register} errors={errors} />

        <button type="submit" className="btn btn-primary w-full">
          <MdOutlinePlaylistAdd className="mr-2" />
          Создать
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;