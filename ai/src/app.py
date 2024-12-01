import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from utils import QueryLoader, to_json, capability_advise_to_json

app = FastAPI()
load_dotenv()

# old
"""
{
	"coursePriority" :
	[
		{
			"courseName" : "서양철학의이해",
			"courseNumber" : "009357",
            "sectionNumber" : "1",
			"professorName" : "David M Hindman",
			"courseTime" : "10:30-12:00",
			"courseDay" : "수금",
            "credit" : 3
		},
		{
			"courseName" : "한국전통문화의이해",
			"courseNumber" : "009356",
            "sectionNumber" : "3",
			"professorName" : "시지은",
			"courseTime" : "15:00-16:30",
			"courseDay" : "월수",
            "credit" : 3
		}
	],

	"timeoff" :
	[
		{
			"day" : "목",
			"time" : "9:00-11:00"
		}
	],

        "dayoff" : ["화"],
        "department" : "소프트웨어학과",
        "semester" : 2,
        "credit" : 15
}
"""

# new
"""
{
    "user_id" : "asdppopop",
	"coursePriority" :
	[
		{
			"courseName" : "서양철학의이해",
			"courseNumber" : "009357",
            "sectionNumber" : "1",
			"professorName" : "David M Hindman",
			"courseTime" : "10:30-12:00",
			"courseDay" : "수금",
            "credit" : 3
		},
		{
			"courseName" : "인공지능",
			"courseNumber" : "011172",
            "sectionNumber" : "1",
			"professorName" : "심태용",
			"courseTime" : "12:00-13:30",
			"courseDay" : "월수",
            "credit" : 3
		}
	],

	"timeoff" :
	[
		{
			"day" : "목",
			"time" : "9:00-11:00"
		}
	],

        "dayoff" : [],
        "credit" : 15
}
"""

"""
{
    "user_id" : "asdppopop",
	"coursePriority" :
	[
		{
			"courseName" : "서양철학의이해",
			"courseNumber" : "009357",
            "sectionNumber" : "1",
			"professorName" : "David M Hindman",
			"courseTime" : "10:30-12:00",
			"courseDay" : "수금",
            "credit" : 3
		},
		{
			"courseName" : "인공지능",
			"courseNumber" : "002505",
            "sectionNumber" : "1",
			"professorName" : "Mohammad Jalil Piran",
			"courseTime" : "12:00-13:30",
			"courseDay" : "화목",
            "credit" : 3
		}
	],

	"timeoff" :
	[
		{
			"day" : "목",
			"time" : "9:00-11:00"
		}
	],

        "dayoff" : ["화"],
        "credit" : 15
}
"""

"""
{
    "user_id" : "asdppopop",
	"coursePriority" : [],

	"timeoff" :
	[
		{
			"day" : "목",
			"time" : "9:00-11:00"
		}
	],

        "dayoff" : [],
        "credit" : 15
}
"""


@app.post("/course/recommend")
async def course_rec(payload: dict):
    print(payload)
    if payload is False:
        raise HTTPException(status_code=400, detail="Input data is missing")
    loader = QueryLoader(payload["user_id"], payload["coursePriority"], payload["timeoff"], payload["dayoff"])
    credits = payload["credit"] - sum([element["credit"] for element in payload["coursePriority"]])

    department, semester = loader.get_user_info()

    main_data = loader.get_main_data()
    priority_data = loader.get_priority_data()
    print(priority_data)
    # LangChain 프롬프트 및 모델 설정
    prompt = PromptTemplate(
        input_variables=["data", "department", "credit", "semester"],
        template="""
        "I am recommending university courses based on a specific credit requirement provided by the user. I have access to a course catalog in the following format: courseNumber | sectionNumber | courseName | courseClassification | semester | courseDescription | professorName | courseDay | courseTime | credits, where fields are separated by a |.

        Please help me select courses according to these rules:

        Priority Order: Recommend courses following this courseClassification order: '전기', '전필', '전선', '기필', ETC...
        Semester Order: Recommend courses follo wing this order: low semester to high semester
        Unique Course Names: Each recommended course should have a unique course name, avoiding any duplicates.
        No Time Conflicts: Ensure that recommended courses do not overlap in time on the same course day. For instance, a course scheduled on Thursday from 4 PM to 5 PM cannot overlap with a course scheduled on Thursday from 4 PM to 6 PM.
        Recommendation Rationale: Use each courses courseDescription to explain why it was recommended.
        Credit Match: *Ensure that the sum of credits of recommended courses equals or does not exceed the user's input credit requirement. Prioritize combinations that precisely meet the target {credit} credits without exceeding it. If exact matching is not possible, select the closest lower value.* *If you get 15 credits as input, get 15 credits as much as you must can.*
        When generating responses, ensure that no Markdown formatting elements such as ###, ##, or * are included in the text.
        Please output the results in the following format for each recommended course: $courseNumber | sectionNumber | courseName | credits | professorName | [Reason for Recommendation]$


        Format the output strictly as follows:
        $courseNumber | sectionNumber | courseName | professorName | [Reason for Recommendation based on course description]$

        Example:
        $10101 | 1 | Introduction to Programming | [This course is essential for understanding basic programming principles.]$
        $10102 | 2 | AI Programming | [This course is essential for understanding basic programming principles.]$
        $10103 | 1 | NLP | [This course is essential for understanding basic programming principles.]$

        Generate a list of courses adhering to this template. *Anwer into Korean*
        Must Put $ before and after the recommended subject!
        {data}
        Must recommend a course as close *as possible to {credit} credits* after looking at the data above. If the given grade is 15, please recommend a course close to 15 credits. Also, please recommend a course suitable for the {department} department and {semester} semester.
            """,
    )

    llm = ChatOpenAI(temperature=1, model_name="gpt-4o", openai_api_key=os.getenv("OPENAI_API_KEY"))
    llm_chain = LLMChain(llm=llm, prompt=prompt)

    # chain = load_qa_chain(llm, chain_type="stuff")

    input_data = {"department": department, "credit": credits, "data": main_data, "semester": semester}

    # def rec_table():
    response = llm_chain.invoke(input=input_data)
    print(response)
    # return response
    # recommendation = rec_table()
    # print(response["text"])
    # print('\n\n')
    # print(main_data)
    # print('\n\n')
    # print(priority_data)
    # print('\n\n')
    # print(recommendation)
    result = to_json(priority_data, response["text"])
    return JSONResponse(content=jsonable_encoder(result))


@app.post("/test/test")
async def process_data(payload: dict):
    if payload is False:
        raise HTTPException(status_code=400, detail="Input data is missing")

    loader = QueryLoader(
        QueryLoader(payload["user_id"], payload["coursePriority"], payload["timeoff"], payload["dayoff"])
    )
    credits = payload["credit"] - sum([element["credit"] for element in payload["coursePriority"]])

    main_data = loader.get_main_data()
    priority_data = loader.get_priority_data()
    return main_data


@app.post("/skill/recommend")
async def skill_rec(skill_score: dict):
    """
    {
    "ai" : 9,
    "language" : 7,
    "server" : 6,
    "cs" : 5,
    "ds" : 6,
    "algorithm" : 7
    }
    """

    # print(skill_score)
    prompt = PromptTemplate(
        input_variables=["ai_value", "language_value", "server_value", "cs_value", "ds_value", "algorithm_value"],
        template="""Analyze the software capabilities based on the following competency scores. Each score is out of 30, with 30 being the maximum. For any competency scoring below 24, identify it as an area for improvement and provide specific, actionable advice. If the score is 8 or higher, acknowledge it as a strength and provide encouragement.

    Competency Scores:
    - AI Capabilities Score: {ai_value}
    - Programming Language Capabilities Score: {language_value}
    - Server Capabilities Score: {server_value}
    - Computer Science Capabilities Score: {cs_value}
    - Data Science Capabilities Score: {ds_value}
    - Algorithm Capabilities Score: {algorithm_value}

    Step-by-Step Analysis:
    1. Identify scores below 24 and label them as areas for improvement.
    2. For each area, analyze what key skills or knowledge are essential but may be lacking based on the score.
    3. Suggest specific ways to build on these skills, including resources, learning strategies, or types of projects to pursue.
    4. For scores of 24 or higher, acknowledge them as strengths and provide words of encouragement to maintain or further enhance the proficiency.

    Output Format:$Score | advice$
    
    Examples of Analysis:

    Example 1:
    Competency Scores:
    - AI Capabilities Score: 21
    - Programming Language Capabilities Score: 27
    - Server Capabilities Score: 18
    - Computer Science Capabilities Score: 24
    - Data Science Capabilities Score: 24
    - Algorithm Capabilities Score: 18

    Analysis:
    $AI Capabilities Score | 21 | Focus on foundational machine learning concepts, including supervised learning and model optimization. Suggested actions: Study Andrew Ng's "Machine Learning" on Coursera and apply knowledge in hands-on projects such as building a regression model.$
    $Programming Language Capabilities Score | 27 | Excellent programming skills! Keep up the great work by exploring advanced topics such as asynchronous programming or contributing to open-source projects.$
    $Server Capabilities Score | 18 | Strengthen server management and networking basics. Suggested actions: Use online labs like AWS Educate to practice server setup, study HTTP protocols, and learn security measures on platforms like Udemy.$
    $Computer Science Capabilities Score | 24 | Great foundation in computer science! To further excel, consider delving into distributed systems or competitive programming challenges.$
    $Data Science Capabilities Score | 24 | Strong data science skills! Continue to build expertise by exploring advanced machine learning techniques or participating in Kaggle competitions.$
    $Algorithm Capabilities Score | 18 | Enhance understanding of sorting, searching, and optimization techniques. Suggested actions: Solve exercises on LeetCode, focusing on algorithm efficiency and complexity.$

    ---

    Example 2:
    Competency Scores:
    - AI Capabilities Score: 27
    - Programming Language Capabilities Score: 18
    - Server Capabilities Score: 24
    - Computer Science Capabilities Score: 21
    - Data Science Capabilities Score: 18
    - Algorithm Capabilities Score: 24

    Analysis:
    $AI Capabilities Score | 27 | Excellent AI knowledge! Keep refining your expertise by exploring state-of-the-art AI topics such as reinforcement learning or generative AI. Consider contributing to open-source AI projects.$
    $Programming Language Capabilities Score | 18 | Strengthen your grasp of fundamental programming concepts. Suggested actions: Take interactive courses on Codecademy or Udemy, focusing on object-oriented programming and debugging.$
    $Server Capabilities Score | 24 | Great job with server skills! To stay ahead, consider learning about containerization with Docker and Kubernetes or exploring serverless architectures.$
    $Computer Science Capabilities Score | 21 | Improve understanding of key data structures like graphs and trees. Suggested actions: Follow tutorials on YouTube channels like "CS50" and solve medium-level problems on HackerRank.$
    $Data Science Capabilities Score | 18 | Build confidence in statistics and data visualization. Suggested actions: Use DataCamp or Kaggle to learn and practice Python libraries like pandas, NumPy, and seaborn.$
    $Algorithm Capabilities Score | 24 | Strong algorithm skills! Maintain your edge by tackling more challenging problems on platforms like Codeforces and reviewing advanced algorithm topics like dynamic programming.$

    Example 3:
    Competency Scores:
    - AI Capabilities Score: 24
    - Programming Language Capabilities Score: 24
    - Server Capabilities Score: 27
    - Computer Science Capabilities Score: 21
    - Data Science Capabilities Score: 27
    - Algorithm Capabilities Score: 21

    Analysis:
    $AI Capabilities Score | 24 | Strong AI capabilities! Continue to excel by keeping up with the latest research papers and experimenting with transformer-based architectures like BERT or GPT.$
    $Programming Language Capabilities Score | 24 | Well-done on programming! Consider expanding your knowledge by learning functional programming paradigms or exploring multi-threaded programming.$
    $Server Capabilities Score | 27 | Exceptional server management skills! Keep up the great work by gaining expertise in advanced cloud solutions like edge computing or hybrid cloud strategies.$
    $Computer Science Capabilities Score | 21 | Enhance your understanding of computational theory and algorithms. Suggested actions: Explore courses on edX related to theoretical computer science.$
    $Data Science Capabilities Score | 27 | Outstanding data science skills! To further advance, explore deep learning for unstructured data and stay active in competitions to hone your expertise.$
    $Algorithm Capabilities Score | 21 | Improve your algorithm efficiency and optimization skills. Suggested actions: Solve problems involving graph theory and advanced recursion techniques on platforms like LeetCode.$

    **Guidelines for Analysis**:
    - Provide actionable advice for scores below 24.
    - Acknowledge scores of 24 or higher as strengths, offering constructive encouragement.
    - Ensure examples and resources are practical and relevant to real-world applications.
    - Output answers in Korean except for the scores and resource names.
    """,
    )

    load_dotenv()

    # llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")
    llm = ChatOpenAI(temperature=1, model_name="gpt-4o", openai_api_key=os.getenv("OPENAI_API_KEY"))
    llm_chain = LLMChain(llm=llm, prompt=prompt)

    # chain = load_qa_chain(llm, chain_type="stuff")
    input_data = {
        "ai_value": skill_score["ai"],
        "language_value": skill_score["language"],
        "server_value": skill_score["server"],
        "cs_value": skill_score["cs"],
        "ds_value": skill_score["ds"],
        "algorithm_value": skill_score["algorithm"],
    }
    response = llm_chain.invoke(input=input_data)

    result = capability_advise_to_json(response["text"])
    return JSONResponse(content=jsonable_encoder(result))

    # return response["text"]



@app.get("/")
async def hello_world():
    return "hello world"


"""
{
"ai" : 9,
"language" : 7,
"server" : 6,
"cs" : 5,
"ds" : 6,
"algorithm" : 7
}
"""
