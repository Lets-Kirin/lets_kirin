import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from utils import QueryLoader, to_json

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

        "dayoff" : [],
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
        Put $ before and after the recommended subject
        {data}
        Please recommend a course as close *as possible to {credit} credits* after looking at the data above. If the given grade is 15, please recommend a course close to 15 credits. Also, please recommend a course suitable for the {department} department and {semester} semester
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
        template="""Analyze the software capabilities based on the following competency scores. Each score is out of 10, with 10 being the maximum. For any competency scoring below 8, identify it as an area for improvement and provide specific, actionable advice. Here are the scores:

        AI Capabilities Score: {ai_value}
        Programming Language Capabilities Score: {language_value}
        Server Capabilities Score: {server_value}
        Computer Science Capabilities Score: {cs_value}
        Data Science Capabilities Score: {ds_value}
        Algorithm Capabilities Score: {algorithm_value}

        Step-by-Step Analysis with Examples:
        Step 1: Identify scores below 8 and label them as improvement areas.
        Step 2: For each identified area, analyze what key skills or knowledge are essential but may be lacking based on the score.
        Step 3: Suggest specific ways to build on these skills, such as resources, learning strategies, or types of projects to pursue.

        Examples of Analysis:

        Example 1: Moderate Scores in AI, Server, and Algorithm Capabilities

        Scores:
        AI Capabilities Score: 7,
        Programming Language Capabilities Score: 9,
        Server Capabilities Score: 6,
        Computer Science Capabilities Score: 8,
        Data Science Capabilities Score: 8,
        Algorithm Capabilities Score: 6

        Reasoning and Advice:
        AI Capabilities Score (7): Focus on foundational machine learning concepts, including supervised learning and model optimization. Suggested actions: study through courses like "Machine Learning" by Andrew Ng on Coursera, and apply knowledge in hands-on projects such as building a classification or regression model.
        Server Capabilities Score (6): Strengthen server management and networking basics. Suggested actions: explore online labs on AWS or Google Cloud to practice server setup and network configuration; study HTTP protocols and basic security measures through tutorials on platforms like Udacity.
        Algorithm Capabilities Score (6): Increase understanding of core algorithms, including sorting, searching, and optimization techniques. Suggested actions: work through exercises on platforms like LeetCode and HackerRank, focusing on algorithm efficiency and complexity. Reviewing classic algorithms like binary search, mergesort, and quicksort will be beneficial.


        Example 2: Low Scores in Programming Language, Computer Science, and Data Science

        Scores:
        AI Capabilities Score: 9,
        Programming Language Capabilities Score: 6,
        Server Capabilities Score: 8,
        Computer Science Capabilities Score: 7,
        Data Science Capabilities Score: 6,
        Algorithm Capabilities Score: 8

        Reasoning and Advice:
        Programming Language Capabilities Score (6): A score of 6 indicates the need to strengthen programming skills in languages like Python, Java, or C++. Suggested actions: Practice problem-solving on platforms like HackerRank and LeetCode, complete beginner and intermediate programming courses on Codecademy, and work on real-world projects like developing a calculator or a small web application to build confidence in coding syntax and debugging.
        Computer Science Capabilities Score (7): Strengthen knowledge in data structures (e.g., arrays, hash maps) and fundamental programming principles. Suggested actions: complete exercises on LeetCode or HackerRank, and review algorithms and data structures through video tutorials on YouTube.
        Data Science Capabilities Score (6): Develop a deep er understanding of data analysis and visualization techniques. Suggested actions: consider courses on DataCamp or edX that cover statistics, data cleaning, and visualization in Python. Practice analyzing datasets on Kaggle to build practical skills.


        Example 3: Balanced Scores with Improvement Needed in AI and Algorithm

        Scores: AI Capabilities Score: 6,
        Programming Language Capabilities Score: 8,
        Server Capabilities Score: 8,
        Computer Science Capabilities Score: 9,
        Data Science Capabilities Score: 9,
        Algorithm Capabilities Score: 7

        Reasoning and Advice:
        AI Capabilities Score (6): Strengthen machine learning foundations, particularly supervised learning methods and neural networks. Suggested actions: take a beginner ML course (e.g., Udacity) and work on a simple prediction model project, such as sentiment analysis.
        Algorithm Capabilities Score (7): Enhance skills in key algorithms and improve understanding of time complexity. Suggested actions: complete exercises focused on sorting and search algorithms on LeetCode, and review Big O notation and algorithm analysis through tutorials.


        Instructions for Model: Analyze the input scores according to the examples above. For any score below 8, provide tailored advice for each relevant area. If all scores are 8 or above, provide high-level guidance on achieving mastery and staying updated on the latest advancements.
        *Anser to Korean*""",
    )
    from dotenv import load_dotenv

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

    return response["text"]


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
