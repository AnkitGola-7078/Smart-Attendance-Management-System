import { useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";


function Dashboard() {


  const [date, setDate] = useState("");

  const [data, setData] = useState(null);


  const getDashboard = async()=>{

    try{

      const response = await API.get(
        `/dashboard?date=${date}`
      );

      setData(response.data.data);


    }catch(error){

      console.log(error);

      alert("Failed to load dashboard");

    }

  };


  const chartData = data ? [

    {
      name:"Present",
      count:data.present
    },

    {
      name:"Absent",
      count:data.absent
    }

  ] : [];


return (

<div className="flex min-h-screen">


<Sidebar />


<div className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-900 min-h-screen text-white overflow-x-hidden">


<h1 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 text-green-400">

Attendance Dashboard

</h1>



<div className="bg-slate-800 p-4 sm:p-5 rounded-xl shadow mb-5 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">


<input

type="date"

value={date}

onChange={(e)=>setDate(e.target.value)}

className="border border-slate-600 bg-slate-900 p-3 rounded text-white w-full sm:w-auto"

/>


<button

onClick={getDashboard}

className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 sm:py-2 rounded w-full sm:w-auto"

>

View Attendance

</button>


</div>




{
data && (

<>


<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-5 sm:mb-6">



<div className="bg-slate-800 p-4 sm:p-5 rounded-xl shadow">

<h3 className="text-gray-300">

Total Students

</h3>


<p className="text-2xl sm:text-3xl font-bold text-green-400">

{data.totalStudents}

</p>


</div>





<div className="bg-slate-800 p-4 sm:p-5 rounded-xl shadow">

<h3 className="text-gray-300">

Present

</h3>


<p className="text-2xl sm:text-3xl font-bold text-green-400">

{data.present}

</p>


</div>





<div className="bg-slate-800 p-4 sm:p-5 rounded-xl shadow">

<h3 className="text-gray-300">

Absent

</h3>


<p className="text-2xl sm:text-3xl font-bold text-red-400">

{data.absent}

</p>


</div>





<div className="bg-slate-800 p-4 sm:p-5 rounded-xl shadow">

<h3 className="text-gray-300">

Attendance %

</h3>


<p className="text-2xl sm:text-3xl font-bold text-blue-400">

{data.percentage}%

</p>


</div>



</div>





<div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow mb-5 sm:mb-6">


<h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-green-400">

Attendance Graph

</h2>



<div className="w-full overflow-hidden">

<ResponsiveContainer width="100%" height={280}>

<BarChart data={chartData}>

<XAxis dataKey="name" stroke="white"/>

<YAxis stroke="white"/>

<Tooltip/>

<Bar

dataKey="count"

fill="#22c55e"

/>


</BarChart>


</ResponsiveContainer>

</div>



</div>





<div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow">


<h2 className="text-lg sm:text-xl font-bold mb-5 text-green-400">

Attendance Details

</h2>



<div className="overflow-x-auto">


<table className="w-full min-w-[600px]">


<thead>

<tr className="border-b border-slate-600">


<th className="p-3">

Roll No

</th>


<th>

Name

</th>


<th>

Status

</th>


<th>

Method

</th>


</tr>

</thead>




<tbody>


{

data.records.map((item)=>(


<tr

key={item._id}

className="border-b border-slate-700"

>


<td className="p-3 text-center">

{item.student?.rollNumber}

</td>



<td className="text-center">

{item.student?.name}

</td>



<td className="text-center">


<span

className={
item.status==="Present"
?
"text-green-400 font-bold"
:
"text-red-400 font-bold"
}

>

{item.status}

</span>


</td>




<td className="text-center">

{item.method}

</td>



</tr>


))


}



</tbody>


</table>


</div>


</div>



</>

)

}



</div>


</div>

);

}


export default Dashboard;
