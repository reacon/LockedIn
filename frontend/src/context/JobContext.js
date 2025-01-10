import React, {createContext,useContext,useState} from "react";

const JobContext = createContext(null);

export const JobProvider = ({children}) => {
    const [jobs,setJobs] = useState([])

    return(
        <JobContext.Provider value={{jobs, setJobs}}>
            {children}
        </JobContext.Provider>
    )
}

export const useJobs = () => useContext(JobContext);