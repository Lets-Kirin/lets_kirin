from fastapi import FastAPI, HTTPException
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from utils import QueryLoader

app = FastAPI()

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
			"courseDay" : "수금"
		},
		{
			"courseName" : "한국전통문화의이해",
			"courseNumber" : "009356",
                        "sectionNumber" : "4",
			"professorName" : "시지은",
			"courseTime" : "10:30-12:00",
			"courseDay" : "월수"
		}
	],

	"timeoff" :
	[
		{
			"day" : "목",
			"time" : "9:00-11:00"
		}
	],

        "dayoff" : ["월"],
        "department" : "소프트웨어학과",
        "semester" : 2,
        "credit" : 21
}
"""


@app.post("/course/recommend")
async def process_data(payload: dict):
    if payload is False:
        raise HTTPException(status_code=400, detail="Input data is missing")

    loader = QueryLoader(
        payload["coursePriority"], payload["timeoff"], payload["dayoff"], payload["department"], payload["semester"]
    )
    main_data = loader.main_results()
    priority_data = loader.get_priority_data()
    # LangChain 프롬프트 및 모델 설정
    prompt = PromptTemplate(
        input_variables=["data", "department", "credit"],
        template="""
        "I am recommending university courses based on a specific credit requirement provided by the user. I have access to a course catalog in the following format: courseNumber | sectionNumber | courseName | courseClassification | courseDescription | professorName | courseDay | courseTime | credits, where fields are separated by a |.

        Please help me select courses according to these rules:

        Priority Order: Recommend courses following this order: '전기', '전필', '전선'.
        Unique Course Names: Each recommended course should have a unique course name, avoiding any duplicates.
        No Time Conflicts: Ensure that recommended courses do not overlap in time on the same course day. For instance, a course scheduled on Thursday from 4 PM to 5 PM cannot overlap with a course scheduled on Thursday from 4 PM to 6 PM.
        Recommendation Rationale: Use each courses courseDescription to explain why it was recommended.
        Credit Match: The sum of the credits of recommended courses should closely match the user's input credit requirement. And to take as many credits as possible
        Please output the results in the following format for each recommended course: courseNumber | sectionNumber | courseName | credits | professorName | [Reason for Recommendation]

        Format the output strictly as follows:
        courseNumber | sectionNumber | courseName | professorName | [Reason for Recommendation based on course description]

        Example:
        10101 | A01 | Introduction to Programming | [This course is essential for understanding basic programming principles.]

        Generate a list of courses adhering to this template.
        {data}
        looking at the above data, please recommend a course within {credit} credits for the {department}에""",
    )

    # from langchain.chat_models import ChatOpenAI

    # llm = ChatOpenAI(model_name="gpt-3.5-turbo")
    # llm_chain = LLMChain(llm=llm, prompt=prompt)

    # # chain = load_qa_chain(llm, chain_type="stuff")

    # def rec_table():
    #     response = llm_chain.run(department=payload['department'], credit=payload['credit'], data=main_data)
    #     return response

    # recommendation = rec_table()
    return main_data


@app.post("/test/test")
async def process_data(payload: dict):
    return payload
