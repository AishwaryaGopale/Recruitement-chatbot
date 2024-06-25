import React, { useState, useEffect, useRef } from 'react';
import { TbBorderCorners, TbArrowsMinimize, TbChevronsDown } from "react-icons/tb";
import { SiGooglemessages } from "react-icons/si";
import { FaDownload } from 'react-icons/fa';
import { GoSync } from "react-icons/go";
import {useNavigate,useParams} from "react-router-dom";
import {toast} from "react-toastify";
import axios from 'axios';

const initialState = {
  jobdescription:" ",
  uploadfile:" ",
  promptmsg:" ",
};

const Recruit = () =>{
  const [showPopup, setShowPopup] = useState(false);
  const messageContainerRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [popupSize, setPopupSize] = useState({ width: '400px', height: '700px' });
  const [popupBgColor, setPopupBgColor] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi, I am here to help you. How can I assist you today?", sender: "bot" }
  ]);
  const [showResumeParser, setShowResumeParser] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [promptMessage, setPromptMessage] = useState('Please do a gap analysis of resume loaded with job description and also check if the resume is suitable and can the person be stable in our company. Put all assessments in bulleted format.');
  const [additionalText, setAdditionalText] = useState('');
  const [showAdditionalFunctionality, setShowAdditionalFunctionality] = useState(false);
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); 
  const [submittedData, setSubmittedData] = useState([]);
  const [submittedInterviewData, setSubmittedInterviewData] = useState([]);
  const [criteria, setCriteria] = useState(
    "Please assess candidates on basis of\n" +
    "1) Technology know-how\n" +
    "2) Management experiences\n" +
    "3) Communication skills\n" +
    "4) Stability\n" +
    "5) Domain expertise"
  );
  useEffect(() => {
    // Set the initial criteria state with hardcoded text
    setCriteria(
      "Please assess candidates on basis of\n" +
      "1) Technology know-how\n" +
      "2) Management experiences\n" +
      "3) Communication skills\n" +
      "4) Stability\n" +
      "5) Domain expertise"
    );
  }, []); 
   const info ={   
     email: '',
   whatsappNumber: '',
   date: '',
   hours: '',
   minutes: '',
   contactNumber: '',
   Emailid: '',
   name: '',
   phone: '',
   interviewLink: '',}
  const [planningData, setPlanningData] = useState(info);
const [interviewFeedback, setInterviewFeedback] = useState('');
const [whatwentwrong, setWhatWentWrong] = useState('');
const [state,setState]= useState(initialState);
const [rate, setRate] = useState('');
const {rid}= useParams();

      const handleSubmit = async (e) => {
        e.preventDefault();     
        try {
          const requestData = new FormData();
          requestData.append('jobdescription', description ||"");
          requestData.append('promptmsg', promptMessage||"");
          requestData.append('uploadfile', file||""); // Ensure that 'file' is a File object      
          await axios.post('http://localhost:3000/api/resumeparserpost', requestData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          // Reset form state after successful submission
          setJobDescription('');
          setFile(null);
          setPromptMessage('');      
          // Optionally show a success message to the user
          alert('Form submitted successfully');
        } catch (error) {
          console.error('Error submitting form:', error);
          // Optionally show an error message to the user
          alert('An error occurred while submitting the form');
        }
      };
      
      const handleAdditionalText = async (e) => {
        e.preventDefault();      
        try {
          const requestData = new FormData();
          requestData.append('criteria', criteria ||"");
          requestData.append('prompt', additionalText||"");
          requestData.append('uploadfile', screeningFile||""); // Ensure that 'file' is a File object
      
          await axios.post('http://localhost:3000/api/screeningpost', requestData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          // Reset form state after successful submission
          setCriteria('');
          setScreeningFile(null);
          setAdditionalText('');     
          // Optionally show a success message to the user
          alert('Form submitted successfully');
        } catch (error) {
          console.error('Error submitting form:', error);
          // Optionally show an error message to the user
          alert('An error occurred while submitting the form');
        }
      };

      const submitPlanningData = async (e) => {
        e.preventDefault();        
        try {
          const requestData = {
            email: planningData.email || "",
            whatsapp: planningData.whatsappNumber || "",
            date: planningData.date || "",
            time: planningData.hours || "",
            contact: planningData.contactNumber || ""
          };         
          await axios.post('http://localhost:3000/api/schedulepost', requestData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          setSubmittedData(prevData => [...prevData, requestData]);
          // Reset form state after successful submission
          setPlanningData({
            email: '',
            whatsappNumber: '',
            date: '',
            hours: '',
            contactNumber: ''
          });      
          // Optionally show a success message to the user
          alert('Form submitted successfully');
        } catch (error) {
          console.error('Error submitting form:', error);
          // Optionally show an error message to the user
          alert('An error occurred while submitting the form');
        }
      };
      
      const submitInterviewPlan = async (e) => {
        e.preventDefault();     
      
        try {
          const requestData = new FormData();
          requestData.append('name', planningData.name || "");
          requestData.append('emailid', planningData.Emailid || "");
          requestData.append('phone', planningData.phone || "");
          requestData.append('link', planningData.interviewLink || "");     
      
          const response = await axios.post('http://localhost:3000/api/interviewpost', requestData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      
          console.log('Response from server:', response.data);
      
          // Assuming setSubmittedInterviewData and setPlanningData are state setters
          setSubmittedInterviewData((prevData) => [...prevData, {
            name: planningData.name,
            emailid: planningData.Emailid,
            phone: planningData.phone,
            link: planningData.interviewLink
          }]);
          
          // Reset form state after successful submission
          setPlanningData({
            name: '',
            Emailid: '',
            phone: '',
            interviewLink: ''
          });
      
          // Optionally show a success message to the user
          alert('Form submitted successfully');
        } catch (error) {
          console.error('Error submitting form:', error);
          
          // Optionally show an error message to the user
          alert('An error occurred while submitting the form');
        }
      };
      
           
      const handleFeedbackbutton = async (e) => {
        e.preventDefault();      
        try {
          const requestData = new FormData();
          requestData.append('interviewFeedback', interviewFeedback || "");
          requestData.append('whatWentWrong', whatwentwrong || "");
          requestData.append('rating', rate || "");     
          await axios.post('http://localhost:3000/api/feedbackpost', requestData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });      
          // Reset form state after successful submission
          setInterviewFeedback('');
          setWhatWentWrong('');
          setRate('');      
          // Optionally show a success message to the user
          alert('Feedback submitted successfully');
        } catch (error) {
          console.error('Error submitting form:', error);
          // Optionally show an error message to the user
          alert('An error occurred while submitting the feedback');
        }
      };
      
      const handleInputChange = (e) => {
        const { name, value, files } = e.target;     
        if (files && files.length > 0) {
          // If files are present, update the file state
          setFile(files[0]);
        } else {
          // For text inputs, update the corresponding state value
          setState({ ...state, [name]: value });
        }
      };
         
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };
  
  const togglePopup = () => {
    setShowPopup(!showPopup);
    setIsFullScreen(false);
  };
  const resizePopup = () => {
    if (!isFullScreen) {
      if (popupSize.width === '400px') {
        setPopupSize({ width: '800px', height: '700px' });
        setPopupBgColor('');
      } else {
        setPopupSize({ width: '400px', height: '700px' });
        setPopupBgColor('');
      }
    }
  };
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      setPopupSize({ width: '100%', height: '100%' });
    } else {
      setPopupSize({ width: '400px', height: '700px' });
    }
    setIsFullScreen(!isFullScreen);
  };
  const closePopup = () => {
    setShowPopup(false);
    setIsFullScreen(false);
  };  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleResumeParserSubmit = async () => {
    const prompt = document.getElementById('jobDescription').value;
    try {
      // Make a request to the Quantile API
      const response = await fetch(`https://quantileapibeta.online/call_cascading?prompt=${encodeURIComponent(prompt)}&max_tokens=800`, {
        method: 'GET',
        headers: {
          'quant-api-key': 'quant-3rzCLlkmjyamQWB4oW1jF' 
        }
      });  
      if (!response.ok) {
        throw new Error('Failed to fetch response from the server.');
      }
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        // Set the fetched job description
        setJobDescription(data);
        if (file && additionalText) {
          performGapAnalysis(data, file, additionalText);
        }
      } else {
        throw new Error('No choices found in the response.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const performGapAnalysis = (jobDescription, uploadedFile, additionalText) => {
    // Perform gap analysis or any other submission logic here
    console.log('Performing gap analysis...');
    console.log('Job Description:', jobDescription);
    console.log('Uploaded File:', uploadedFile);
    console.log('Additional Text:', additionalText);
  }; 
  // JSX for the submit button in the resume parser section
  <button className="bg-black text-white rounded-md px-2 py-1 mt-2" onClick={handleResumeParserSubmit}>
    Submit
  </button>
  
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };
  const removeFile = () => {
    setFile(null);
  };
  const downloadFile = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(fileURL);
    }
  };
 
  const handleRefresh = () => {
    setMessages([
      { text: "Hi, I am here to help you. How can I assist you today?", sender: "bot" }
    ]);
    setShowResumeParser(false); // Reset the resume parser state
    setFile(null); // Reset the file state
    setAdditionalText(''); // Reset the additional text state
    setCriteria(
      "Please assess candidates on basis of\n" +
      "1) Technology know-how\n" +
      "2) Management experiences\n" +
      "3) Communication skills\n" +
      "4) Stability\n" +
      "5) Domain expertise"
    );
    setPromptMessage('Please do a gap analysis of resume loaded with job description and also check if the resume is suitable and can the person be stable in our company. Put all assessments in bulleted format.');
    setShowAdditionalFunctionality(false);
    setShowScheduleOptions(false);
    setShowFeedback(false);
    setScreeningFile(false);
    setScheduleFile(false);
    setResponse(false); 
    setSubmittedData(false);
  };
  
  const toggleAdditionalFunctionality = () => {
    setShowAdditionalFunctionality(!showAdditionalFunctionality);
  };
  // Function to toggle schedule options visibility
  const toggleScheduleOptions = () => {
    setShowScheduleOptions(!showScheduleOptions);
  };
  
 // Function to handle input changes in the planning form
  const handlePlanningInputChange = (e) => {
    const { name, value } = e.target;
    setPlanningData({
      ...planningData,
      [name]: value
    });
  };
 
  const clearInterviewPlanData = () => {
    setPlanningData({
      email: '',
      whatsappNumber: '',
      date: '',
      hours: '',
      minutes: '',
      ampm: '',
      contactNumber: '',
      Emailid: '',
      name: '', 
      phone: '', 
      interviewLink: '' 
    });
  };
  
  const handleFeedback = () => {
    setShowFeedback(!showFeedback);
  };

  const removeScreeningFile = () => {
    setScreeningFile(null);
  };
  const [screeningFile, setScreeningFile] = useState(null);

const handleScreeningFileUpload = (e) => {
  setScreeningFile(e.target.files[0]);
};

const downloadScreeningFile = () => {
  if (screeningFile) {
    const fileURL = URL.createObjectURL(screeningFile);
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = screeningFile.name;
    a.click();
    URL.revokeObjectURL(fileURL);
  }
};
const [scheduleFile, setScheduleFile] = useState(null);
const handleScheduleFileUpload = (event) => {
  const uploadedFile = event.target.files[0];
  setScheduleFile(uploadedFile);
};

const downloadScheduleFile = () => {
  if (scheduleFile) {
    const fileURL = URL.createObjectURL(scheduleFile);
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = scheduleFile.name;
    a.click();
    URL.revokeObjectURL(fileURL);
  }
};

const removeScheduleFile = () => {
  setScheduleFile(null);
};

const [db_name, setDbName] = useState("");
  const [pdf_file, setPdfFile] = useState(null);
  const [description, setDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  
  const base_url = "https://quantileapibeta.online";
  const api_key = "quant-3rzCLlkmjyamQWB4oW1jF";

  const ragDataUpload = async () => {
    const url = `${base_url}/rag_data_upload`;

    const formData = new FormData();
    // formData.append("db_name", db_name);
    formData.append("pdf_file", file||screeningFile);
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "quant-api-key": api_key,
        },
        params: {
          db_name: "myresume",
          pdf_file: formData.file,
          chunk_size: 100,
          chunk_overlap: 10,
          embedding_model: "text-embedding-3-small",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const ragChat = async () => {
    const url = `${base_url}/rag_assistant`;
    const params = {
      db_name: "myresume",
      description: description,
      question: promptMessage,
      embedding_model: "text-embedding-3-small",
      inference_model: "gpt-3.5-turbo-0125",
      temperature: 0,
    };
    try {
      const response = await axios.get(url, {
        headers: {
          "quant-api-key": api_key,
        },
        params: params,
      });
      setResponse(response.data);
    } catch (error) {
      console.error("Error fetching chat response:", error);
    }
  };

  const ragd = async () => {
    const url = `${base_url}/rag_assistant`;
    const params = {
      db_name: "myresume",
      description: criteria,
      question: additionalText,
      embedding_model: "text-embedding-3-small",
      inference_model: "gpt-3.5-turbo-0125",
      temperature: 0,
    };
    try {
      const response = await axios.get(url, {
        headers: {
          "quant-api-key": api_key,
        },
        params: params,
      });
      setResponse(response.data);
    } catch (error) {
      console.error("Error fetching chat response:", error);
    }
  };

  async function handleBoth(event) {
    await handleSubmit(event);
    ragChat();
    ragDataUpload();
  }
  <button className="bg-black text-white rounded-md px-2 py-1 mt-2" onClick={handleBoth}>
    Submit
  </button>

async function handleB(event) {
  await handleAdditionalText(event);
  ragd();
  ragDataUpload();
}
<button className="bg-black text-white rounded-md px-2 py-1 mt-2" onClick={handleB}>
  Submit
</button>

const [jobdescription, setJobDescriptions] = useState([]);
const [error, setError] = useState(null);

const fetchjobdescriptions = async () => {
  try {
    const response = await axios.get('/api/referjdget');
    setJobDescriptions(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    setError('Failed to fetch job descriptions');
  }
};
    
  return (
    <div>
      <div className="flex justify-end items-end h-screen p-4">
        {!showPopup && (
          <button onClick={togglePopup} className="bg-[#294293] hover:bg-[#294293] text-white hover:text-[black] font-[30px] py-2 px-4 rounded">
            <SiGooglemessages />
          </button>
        )}
        <div>
          {showPopup && (
            <div className={`fixed top-0 right-0 rounded-[10px] shadow-md border-2 border-black  ${popupBgColor}`} style={{ width: popupSize.width, height: popupSize.height }}>
              <div className="flex justify-between items-center p-4 bg-[#436efc] rounded-[10px]">
                <div>
                  <h2 className="text-lg font-bold text-white">Virtual CHATBOT </h2>
                </div>
                <div className="flex space-x-4">
                  <button onClick={resizePopup}>
                    {/* <TbBorderCorners /> */}
                  </button>
                  <button onClick={toggleFullScreen}>
                    {isFullScreen ? <TbArrowsMinimize /> : <TbBorderCorners />}
                  </button>
                  <button onClick={closePopup} className="  font-bold rounded"><TbChevronsDown /></button>
                </div>
                <div className="text-black hover:text-red text-[15px] pr-2 rounded-md disabled:pointer-events-none disabled:opacity-30 h-7 px-2 py-2 " onClick={handleRefresh} >
                 <GoSync />
             </div>
              </div>

              <div className="overflow-y-auto max-h-[600px] max-w-[900px]"
                  onSubmit={handleSubmit}>           
                {/* Content of the popup */}
                <div ref={messageContainerRef} className="overflow-y-auto max-h-[500px] max-w-[800px]">
                  {messages.map((message, index) => (
                    <div key={index} className={`text-${message.sender === 'bot' ? 'top' : 'bottom'} py-1 px-2 m-2 bg-gray-200 rounded-md inline-block`}>
                      {message.text}
                    </div>
                  ))}              
                </div>
                {showResumeParser ? (
                  <>
                    <div>
                    <button onClick={fetchjobdescriptions}>referJDs</button>
                    <div>
                      {error && <p>{error}</p>}
                      {jobdescription.map((item, index) => (
                        <p key={index}>{item.jobdescription}</p>
                      ))}
                    </div>
                  </div> 
                  <div className="mt-4">
                    <h3 className="font-bold mt-2">Job Description</h3>
                    <textarea
                      id="jobDescription"
                      className="w-full h-32 p-2 border border-gray-300 rounded-md"
                      placeholder="Description"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      name="jobDescription" // Add name attribute to associate with state
                      type="text"  />  </div>                
                    
                    {/* File upload */}
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer">Upload File</label>
                      <input
                        type="file"
                        onChange={handleFileChange} // Update to handleFileUpload function
                        id="file-upload"
                        className="hidden"
                        placeholder="file"
                      />
                      <button onClick={ragDataUpload}>Upload PDF</button>
                      {file && (
                        <div className="flex items-center mt-2">
                          <FaDownload onClick={downloadFile} className="text-blue-500 cursor-pointer mr-2" />
                          <span>{file.name}</span>
                          <button onClick={removeFile} className="text-red-600 ml-2"><span aria-hidden="true">×</span></button>
                        </div>
                      )}
                    </div>

                      <textarea
                    id="promptMessage"
                    className="w-full h-32 p-2 border border-gray-300 rounded-md mt-4"
                    placeholder="Question"
                    value={promptMessage} // Set the value to the promptMessage state
                    onChange={(e) => setQuestion(e.target.value)} // Update the state on change if needed
                    name="promptMessage" // Add name attribute to associate with state
                    type="text"
                  />
                        {response && (
                          <div>
                            <p>Response:</p>
                            <p>{response}</p>
                          </div>
                        )}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="bg-black text-white rounded-md px-2 py-1 mt-2" onClick={handleBoth}>
                          Submit
                        </button>
                      </div>
                    </>
                  ) : (
                    <button className="bg-blue-500 text-white font-bold rounded-md px-4 py-2 mt-2" onClick={() => setShowResumeParser(true)}>Resume Parser</button>
                  )}

                <div>
                  <button className="bg-blue-500 text-white font-bold rounded-md px-4 py-2 mt-2" onClick={toggleAdditionalFunctionality}>
                    Screening
                  </button>
                </div>
                {showAdditionalFunctionality && (
                  <div>
                    <h3 className=" font-bold mt-4">Criteria</h3>
                    <textarea
                      id="criteria"
                      value={criteria} // Set the value to the criteria state
                      onChange={(e) => setCriteria(e.target.value)} // Update the state on change if needed
                      className="w-full h-32 p-2 border border-gray-300 rounded-md mt-2"
                      placeholder="Enter criteria..."
                      name="criteria"
                      type="text"
                    />

                    <div className="mt-4">
                    <label htmlFor="screening-file-upload" className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer">Upload File</label>
                    <input 
                    type="file" 
                    onChange={handleScreeningFileUpload} 
                    id="screening-file-upload" 
                    className="hidden" 
                    placeholder='file'
                    />
                    <button onClick={ragDataUpload}>Upload PDF</button>
                    {screeningFile && (
                      <div className="flex items-center mt-2">
                        <FaDownload onClick={downloadScreeningFile} className="text-blue-500 cursor-pointer mr-2" />
                        <span>{screeningFile.name}</span>
                        <button onClick={removeScreeningFile} className="text-red-600 ml-2"><span aria-hidden="true">×</span></button>
                      </div>
                    )}
                  </div>
                    <h3 className=" font-semibold mt-4">Prompt message</h3>
                    <textarea
                      id="prompt"
                      value={additionalText}
                      onChange={(e) => setAdditionalText(e.target.value)}
                      className="w-full h-30 p-2 border border-gray-300 rounded-md mt-2"
                      placeholder="Type your prompt message..."  
                      name="prompt"     
                      type="text"           
                    />                    
                     {response && (
                          <div>
                            <p>Response:</p>
                            <p>{response}</p>
                          </div>
                        )}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="bg-black text-white rounded-md px-2 py-1 mt-2" onClick={handleB}>Submit</button>
                  </div>
                  </div>
                )}
                {/* schedule */}
                <div>
                  <button onClick={toggleScheduleOptions} className="bg-blue-500 text-white font-bold rounded-md px-4 py-2 mt-2 mr-2">
                    Schedule
                  </button>
                  {showScheduleOptions && (
                    <div>
                      <button className="bg-gray-500 text-white font-bold rounded-md px-4 py-2 mt-2 mr-2">
                        Planning
                      </button>
                      <div className="mt-4">
                        <div className="flex flex-col space-y-2">
                          {/* Textboxes for Planning */}
                          <input
                            type="text"
                            name="email"
                            id="email"
                            value={planningData.email}
                            onChange={handlePlanningInputChange}
                            placeholder="Email"
                            className="w-full h-10 px-3 rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            name="whatsappNumber"
                            id="whatsappNumber"
                            value={planningData.whatsappNumber}
                            onChange={handlePlanningInputChange}
                            placeholder="WhatsApp Number"
                            className="w-1/2 h-10 px-3 rounded border border-gray-300"
                          />
                          <input
                            type="date"
                            name="date"
                            id="date"
                            value={planningData.date}
                            onChange={handlePlanningInputChange}
                            className="w-1/2 h-10 px-3 rounded border border-gray-300"
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="time"
                              name="hours"
                              id="hours"
                              value={planningData.hours}
                              onChange={handlePlanningInputChange}
                              className="w-1/2 h-10 px-3 rounded border border-gray-300"
                            />
                          </div>
                          <input
                            type="text"
                            id="contactNumber"
                            name="contactNumber"
                            value={planningData.contactNumber}
                            onChange={handlePlanningInputChange}
                            placeholder="Contact Number"
                            className="w-1/2 h-10 px-3 rounded border border-gray-300"
                          />
                           <div className="grid grid-cols-5 gap-4 mt-2">
                              {submittedData.map((data, index) => (
                                <div key={index} className="border p-2 rounded">
                                  <p><strong>Email:</strong> {data.email}</p>
                                  <p><strong>WhatsApp:</strong> {data.whatsapp}</p>
                                  <p><strong>Date:</strong> {data.date}</p>
                                  <p><strong>Time:</strong> {data.time}</p>
                                  <p><strong>Contact:</strong> {data.contact}</p>
                                </div>
                              ))}
                            </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button className="bg-black text-white rounded-md px-2 py-1 mr-2" onClick={submitPlanningData}>
                            Submit
                          </button>   
                          </div>
                          
                   <div>
                  {showScheduleOptions && (
                    <div>
                      <button className="bg-gray-500 text-white font-bold rounded-md px-4 py-2 mt-2 mr-2">
                        Interview Bot
                      </button>
                      <div className="mt-4">
                        <div className="flex flex-col space-y-2">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={planningData.name}
                            onChange={handlePlanningInputChange}
                            placeholder="Name"
                            className="w-full h-10 px-3 rounded border border-gray-300"
                          />
                          <input
                            type="Emailid"
                            name="Emailid"
                            id="emailid"
                            value={planningData.Emailid}
                            onChange={handlePlanningInputChange}
                            placeholder="Emailid"
                            className="w-full h-10 px-3 rounded border border-gray-300"
                          />
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={planningData.phone}
                            onChange={handlePlanningInputChange}
                            placeholder="Phone"
                            className="w-full h-10 px-3 rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            name="interviewLink"
                            id="link"
                            value={planningData.interviewLink}
                            onChange={handlePlanningInputChange}
                            placeholder="Interview Link"
                            className="w-full h-10 px-3 rounded border border-gray-300"
                          />
                           <div className="w-full overflow-x-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                              {submittedInterviewData.map((data, index) => (
                                <div key={index} className="border p-2 rounded">
                                  <p><strong>Name:</strong> {data.name}</p>
                                  <p><strong>Email:</strong> {data.emailid}</p>
                                  <p><strong>Phone:</strong> {data.phone}</p>
                                  <p><strong>Interview Link:</strong> {data.link}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          {/* Submit button for Interview Bot */}
                          <button className="bg-black text-white rounded-md px-2 py-1 mr-2" onClick={submitInterviewPlan}>
                            Submit
                          </button>
                          {/* Cancel button to clear filled information */}
                          <button className="bg-red-800 text-white rounded-md px-2 py-1" onClick={clearInterviewPlanData}>
                          Cancel
                        </button>
                        </div>
                      </div>
                    </div>
                      )}
                    </div>                      
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                 {/* Feedback Button */}
             <button className="bg-blue-500 text-white font-bold rounded-md px-4 py-2 mt-2 mr-2" onClick={handleFeedback}>
              Feedback
            </button>
            {showFeedback && (
              <div className="mt-4">
                <div>
                  <h3 className="text-lg font-semibold mt-4">Interview Feedback:</h3>
                  <textarea
                    id="interview-feedback"
                    value={interviewFeedback}
                    onChange={(e) => setInterviewFeedback(e.target.value)}
                    className="w-full h-32 p-2 border border-gray-300 rounded-md"
                    placeholder="Enter interview feedback"
                  ></textarea>
                </div>
                <div className='font-semibold'>
                  <label htmlFor="what-went-wrong" className="block mt-2">What Went Wrong:</label>
                  <textarea 
                    id="what-went-wrong" 
                    value={whatwentwrong}
                    onChange={(e) => setWhatWentWrong(e.target.value)}
                    className="w-full h-32 p-2 border border-gray-300 rounded-md" 
                    placeholder="Enter what went wrong"
                  ></textarea>
                </div>
                <div className='font-semibold'>
                  <label htmlFor="rating" className="block mt-2">Rating:</label>
                  <input 
                    type="number" 
                    id="rating" 
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full h-10 p-2 border border-gray-300 rounded-md" 
                    placeholder="Enter rating"
                  />
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="bg-black text-white rounded-md px-2 py-1 mt-2"
                    onClick={handleFeedbackbutton}
                  > Submit
                  </button>
                  </div>
                    </div>
                  </div>
                )}
              </div>
            </div> )}
        </div>
      </div>
    </div>
  );}
export default Recruit;