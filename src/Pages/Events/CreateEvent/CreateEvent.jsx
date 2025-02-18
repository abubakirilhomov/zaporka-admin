import React, { useState, useEffect } from "react";
import {
  MdDriveFileRenameOutline,
  MdDateRange,
  MdImage,
  MdInfo,
  MdLanguage,
  MdCategory,
  MdLocationOn,
} from "react-icons/md";
import FormInput from "./FormInput/FormInput";
import FileInput from "./FileInput/FileInput";
import DateAndTimeInput from "./DateAndTimeInput/DateAndTimeInput";
import axios from "axios";

const CreateEvent = () => {
  const [event, setEvent] = useState({
    title: { en: "", ru: "", uz: "" },
    area: "",
    organization: "",
    date: [{ date: "", time: { start: "", end: "" } }],
    category: "",
    is2D: false,
    bannerImage: null,
    cardImage: [],
    aboutEvent: { en: "", ru: "", uz: "" },
    ageAndLanguage: { age: "", language: { en: "", ru: "", uz: "" } },
  });

  const [areas, setAreas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch areas using axios
    axios.get("https://api.taketicket.uz/api/v1/areas")
      .then((response) => {
        console.log("Areas response:", response); // Log the response
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
      });

    // Fetch categories using axios
    axios.get("https://api.taketicket.uz/api/v1/categories")
      .then((response) => {
        console.log("Categories response:", response.data); // Log the response
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNestedChange = (parent, key, value) => {
    const keys = parent.split("."); // Split the parent path into keys
    setEvent((prev) => {
      const newState = { ...prev };
      let current = newState;

      // Traverse the nested structure
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      // Update the final nested property
      current[keys[keys.length - 1]] = { ...current[keys[keys.length - 1]], [key]: value };

      return newState;
    });

    // Clear nested errors
    if (errors[`${parent}.${key}`]) {
      setErrors((prev) => ({ ...prev, [`${parent}.${key}`]: "" }));
    }
  };

  const handleDateChange = (index, key, value) => {
    const updatedDates = [...event.date];
    updatedDates[index][key] = value;
    setEvent((prev) => ({ ...prev, date: updatedDates }));
  };

  const handleTimeChange = (index, key, value) => {
    const updatedDates = [...event.date];
    updatedDates[index].time[key] = value;
    setEvent((prev) => ({ ...prev, date: updatedDates }));
  };

  const handleFileChange = (e, field, index = null) => {
    const file = e.target.files[0];
    console.log("files",e.target.files) 
    if (field === "bannerImage") {
      setEvent((prev) => ({ ...prev, bannerImage: file }));
    } else if (field === "cardImage") {
      const updatedCardImages = [...event.cardImage];
      if (index !== null) {
        updatedCardImages[index] = file;
      } else {
        updatedCardImages.push(file);
      }
      setEvent((prev) => ({ ...prev, cardImage: updatedCardImages }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!event.title.uz.trim()) {
      newErrors["title.uz"] = "Title (UZ) is required";
    }

    if (!event?.area?.trim()) {
      newErrors["area"] = "Area is required";
    }

    event.date.forEach((date, index) => {
      if (!date.date.trim()) {
        newErrors[`date[${index}].date`] = "Date is required";
      }
      if (!date.time.start.trim()) {
        newErrors[`date[${index}].time.start`] = "Start time is required";
      }
      if (!date.time.end.trim()) {
        newErrors[`date[${index}].time.end`] = "End time is required";
      }
    });

    if (!event.category.trim()) {
      newErrors["category"] = "Category is required";
    }

    if (!event.bannerImage) {
      newErrors["bannerImage"] = "Banner image is required";
    }

    event.cardImage.forEach((image, index) => {
      if (!image) {
        newErrors[`cardImage[${index}]`] = "Card image is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      const formData = new FormData();
  
      // Append all fields to formData
      formData.append("title[en]", event.title.en);
      formData.append("title[ru]", event.title.ru);
      formData.append("title[uz]", event.title.uz);
      formData.append("area", event.area);
      formData.append("organization", event.organization);
      formData.append("category", event.category);
      formData.append("is2D", event.is2D);
      formData.append("bannerImage", event.bannerImage);
      event.cardImage.forEach((image) => {
        formData.append("cardImage", image);
      });
      formData.append("aboutEvent[en]", event.aboutEvent.en);
      formData.append("aboutEvent[ru]", event.aboutEvent.ru);
      formData.append("aboutEvent[uz]", event.aboutEvent.uz);
      formData.append("ageAndLanguage[age]", event.ageAndLanguage.age);
      formData.append("ageAndLanguage[language][en]", event.ageAndLanguage.language.en);
      formData.append("ageAndLanguage[language][ru]", event.ageAndLanguage.language.ru);
      formData.append("ageAndLanguage[language][uz]", event.ageAndLanguage.language.uz);
      event.date.forEach((date, index) => {
        formData.append(`date[${index}][date]`, date.date);
        formData.append(`date[${index}][time][start]`, date.time.start);
        formData.append(`date[${index}][time][end]`, date.time.end);
      });
  
      // Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      try {
        const response = await fetch("https://api.taketicket.uz/api/v1/events", {
          method: "POST",
          headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTBiMmUwZDU0YTBlYjFjNjlkZjYwNiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3Mzg0MDQ0NTIsImV4cCI6MTczOTAwOTI1Mn0.cncDa6SlJo9EQApmjyAahzHTay37rdoZJz735bO45Mc`,
          },
          body: formData, // Send FormData directly
        });
  
        if (response.ok) {
          console.log("Event created successfully!");
          setSuccess(true);
          setErrors({});
          setEvent({
            title: { en: "", ru: "", uz: "" },
            area: "",
            organization: "",
            date: [{ date: "", time: { start: "", end: "" } }],
            category: "",
            is2D: false,
            bannerImage: null,
            cardImage: [],
            aboutEvent: { en: "", ru: "", uz: "" },
            ageAndLanguage: { age: "", language: { en: "", ru: "", uz: "" } },
          });
        } else {
          console.error("Failed to create event");
          setSuccess(false);
          console.log(response);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSuccess(false);
      }
    } else {
      setSuccess(false);
    }
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <p className="text-2xl font-bold mb-6">Create Event</p>
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {/* Title Section */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
          <FormInput
            label="Title (EN)"
            value={event.title.en}
            onChange={(e) => handleNestedChange("title", "en", e.target.value)}
            placeholder="Title (EN)"
            Icon={MdDriveFileRenameOutline}
          />
          <FormInput
            label="Title (RU)"
            value={event.title.ru}
            onChange={(e) => handleNestedChange("title", "ru", e.target.value)}
            placeholder="Title (RU)"
          />
          <FormInput
            label="Title (UZ)"
            value={event.title.uz}
            onChange={(e) => handleNestedChange("title", "uz", e.target.value)}
            placeholder="Title (UZ)"
            required
            error={errors["title.uz"]}
          />
        </div>

        {/* Area and Organization Section */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
          <FormInput
            label="Area"
            type="select"
            value={event.area}
            onChange={(e) => handleChange({ target: { name: "area", value: e.target.value } })}
            options={[
              { value: "", label: "Select Area", disabled: true },
              ...areas.map((area) => ({ value: area._id, label: area.hall.area })),
            ]}
            required
            error={errors["area"]}
            Icon={MdLocationOn}
          />
          <FormInput
            label="Organization"
            value={event.organization}
            onChange={(e) => handleChange({ target: { name: "organization", value: e.target.value } })}
            placeholder="Organization"
          />
        </div>

        {/* Date and Time Section */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
          <div className="flex items-center text-lg gap-2 mb-4">
            <MdDateRange className="text-primary" />
            <label className="font-semibold">Date & Time</label>
          </div>
          {event.date.map((date, index) => (
            <DateAndTimeInput
              key={index}
              date={date.date}
              onDateChange={(e) => handleDateChange(index, "date", e.target.value)}
              startTime={date.time.start}
              onStartTimeChange={(e) => handleTimeChange(index, "start", e.target.value)}
              endTime={date.time.end}
              onEndTimeChange={(e) => handleTimeChange(index, "end", e.target.value)}
              dateError={errors[`date[${index}].date`]}
              startTimeError={errors[`date[${index}].time.start`]}
              endTimeError={errors[`date[${index}].time.end`]}
            />
          ))}
        </div>

        {/* Category and 2D Section */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
          <FormInput
            label="Category"
            type="select"
            value={event.category}
            onChange={(e) => handleChange({ target: { name: "category", value: e.target.value } })}
            options={[
              { value: "", label: "Select Category", disabled: true },
              ...categories.map((category) => ({ value: category._id, label: category.name })),
            ]}
            required
            error={errors["category"]}
            Icon={MdCategory}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={event.is2D}
              onChange={(e) => handleChange({ target: { name: "is2D", value: e.target.checked } })}
            />
            <span>Is 2D?</span>
          </label>
        </div>

        {/* Banner and Card Images Section */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
          <FileInput
            label="Banner Image"
            onChange={(e) => handleFileChange(e, "bannerImage")}
            error={errors["bannerImage"]}
            preview={event.bannerImage && URL.createObjectURL(event.bannerImage)}
            Icon={MdImage}
          />
          {event.cardImage.map((image, index) => (
            <FileInput
              key={index}
              label={`Card Image ${index + 1}`}
              onChange={(e) => handleFileChange(e, "cardImage", index)}
              error={errors[`cardImage[${index}]`]}
              preview={image && URL.createObjectURL(image)}
            />
          ))}
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => setEvent((prev) => ({ ...prev, cardImage: [...prev.cardImage, null] }))}
          >
            Add Another Card Image
          </button>
        </div>

        {/* About Event Section */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
          <FormInput
            label="About Event (EN)"
            type="textarea"
            value={event.aboutEvent.en}
            onChange={(e) => handleNestedChange("aboutEvent", "en", e.target.value)}
            placeholder="About Event (EN)"
            Icon={MdInfo}
          />
          <FormInput
            label="About Event (RU)"
            type="textarea"
            value={event.aboutEvent.ru}
            onChange={(e) => handleNestedChange("aboutEvent", "ru", e.target.value)}
            placeholder="About Event (RU)"
          />
          <FormInput
            label="About Event (UZ)"
            type="textarea"
            value={event.aboutEvent.uz}
            onChange={(e) => handleNestedChange("aboutEvent", "uz", e.target.value)}
            placeholder="About Event (UZ)"
          />
        </div>

        {/* Age and Language Section */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
          <FormInput
            label="Age"
            value={event.ageAndLanguage.age}
            onChange={(e) => handleNestedChange("ageAndLanguage", "age", e.target.value)}
            placeholder="Age"
            Icon={MdLanguage}
          />
          <FormInput
            label="Language (EN)"
            value={event.ageAndLanguage.language.en}
            onChange={(e) => handleNestedChange("ageAndLanguage.language", "en", e.target.value)}
            placeholder="Language (EN)"
          />
          <FormInput
            label="Language (RU)"
            value={event.ageAndLanguage.language.ru}
            onChange={(e) => handleNestedChange("ageAndLanguage.language", "ru", e.target.value)}
            placeholder="Language (RU)"
          />
          <FormInput
            label="Language (UZ)"
            value={event.ageAndLanguage.language.uz}
            onChange={(e) =>
              handleNestedChange(
                "ageAndLanguage.language",
                "uz",
                e.target.value
              )
            }
            placeholder="Language (UZ)"
          />
        </div>

        {/* Submit Button and Messages */}
        <div className="flex justify-end">
          {success && (
            <p className="text-success text-sm mr-4">
              Event created successfully!
            </p>
          )}
          <button type="submit" className="btn btn-primary">
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
