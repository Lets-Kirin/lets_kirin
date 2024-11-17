import os

import pymysql


class QueryLoader:
    ABEEK = {
        #'학과' : ['과목']
        "건축공학과": [
            "미적분학1",
            "미적분학2",
            "공업수학1",
            "공업수학2",
            "일반물리학1",
            "일반화학1",
            "SW기초코딩",
            "고급프로그래밍활용",
        ],
        "토목공학과": [
            "미적분학1",
            "미적분학2",
            "공업수학1",
            "공업수학2",
            "일반물리학1",
            "일반화학1",
            "SW기초코딩",
            "고급프로그래밍활용",
            "지구환경과학입문",
            "건설수치해석",
        ],
        "환경에너지공간융합학과": [
            "미적분학1",
            "공업수학1",
            "일반물리학1",
            "일반화학1",
            "SW 기초코딩",
            "고급프로그래밍활용",
        ],
        "지구정보공학과": [
            "미적분학1",
            "미적분학2",
            "전산개론-O",
            "전산개론-M",
            "일반물리학실험1",
            "일반물리학실험2",
            "통계학개론",
            "공업수학1",
            "공업수학2",
            "지구의구조및진화",
        ],
        "에너지자원공학과": [
            "미적분학1",
            "미적분학2",
            "공업수학1",
            "일반물리학1",
            "일반화학1",
            "SW기초코딩",
            "고급프로그래밍활용",
        ],
        "기계공학과": [
            "미적분학1",
            "미적분학2",
            "일반물리학1",
            "고급프로그래밍활용",
            "일반화학1",
            "공업수학1",
            "공업수학2",
            "SW기초코딩",
            "고급인공지능활용",
            "수치해석",
        ],
        "항공우주공학과": [
            "미적분학1",
            "미적분학2",
            "공업수학1",
            "공업수학2",
            "일반물리학1",
            "일반화학1",
            "SW기초코딩",
            "고급프로그래밍활용",
            "선형대수학",
            "수치해석",
        ],
        "나노신소재공학과": ["수학", "기초과학", "전산학"],
        "원자력공학과": [
            "SW기초코딩",
            "고급프로그래밍활용",
            "미적분학1",
            "미적분학2",
            "공업수학1",
            "공업수학2",
            "일반물리학1",
            "확률및통계",
            "수치해석",
        ],
        "전자정보통신공학과": [
            "고급프로그래밍활용",
            "확률및통계",
            "C프로그래밍및실습",
            "미적분학1",
            "공업수학1",
            "고급C프로그래밍및실습",
            "선형대수",
            "인공지능과빅데이터",
            "기초전자물리",
        ],
        "전자공학과": [
            "일변수미적분학",
            "공업수학1",
            "공업수학2",
            "선형대수",
            "확률및랜덤변수",
            "일반물리학1",
            "일반물리학2",
            "일반화학",
            "고급프로그래밍입문-C",
            "프로그래밍및실습",
        ],
        "정보통신공학과": [
            "일변수미적분학",
            "공업수학1",
            "공업수학2",
            "선형대수",
            "확률및랜덤변수",
            "일반물리학1",
            "일반물리학2",
            "일반화학",
            "고급프로그래밍입문-C",
            "프로그래밍및실습",
        ],
        "컴퓨터공학과": ["미적분학1", "일반물리학1", "공업수학1", "이산수학및프로그래밍", "확률및통계", "선형대수"],
        "소프트웨어학과": [
            "미적분학1",
            "공업수학1",
            "선형대수",
            "일반물리및시뮬레이션",
            "이산수학및프로그래밍",
            "통계학개론",
        ],
        "디지털콘텐츠학과": [
            "미적분학1",
            "일반물리학1",
            "전산개론-I",
            "공업수학1",
            "이산수학및프로그래밍",
            "통계학개론",
            "선형대수및프로그래밍",
        ],
        "정보보호학과": [
            "이산수학및프로그래밍",
            "미적분학1",
            "일반물리학1",
            "일반생물학",
            "정수론",
            "확률및통계",
            "선형대수",
        ],
        "데이터사이언스학과": [
            "미적분학1",
            "일반물리학1",
            "공업수학1",
            "통계학개론",
            "수치해석",
            "선형대수및프로그래밍",
        ],
        "AI로봇학과": ["확률및통계", "공업수학1", "선형대수", "일반물리학1", "미적분학1"],
        "인공지능학과": [
            "기초미적분학",
            "공업수학1",
            "일반물리학1",
            "확률통계및프로그래밍",
            "선형대수프로그래밍",
            "일반물리학1",
            "이산수학및프로그래밍",
        ],
        "인공지능데이터사이언스학과": [
            "기초미적분학",
            "공업수학1",
            "일반물리학1",
            "확률통계및프로그래밍",
            "선형대수프로그래밍",
            "일반물리학1",
            "이산수학및프로그래밍",
        ],
    }

    def __init__(self, priority_courses: dict, time_off: list, day_off: list, department: str, semester: int) -> None:
        self.time_off = time_off
        self.connection = pymysql.connect(
            host=os.environ.get("DB_HOST"),
            port=os.environ.get("DB_PORT"),
            user=os.environ.get("DB_USER"),
            password=os.environ.get("DB_PASSWORD"),
            db=os.environ.get("DB_NAME"),
        )
        cursor = self.connection.cursor()
        for course in priority_courses:
            course["courseDay"]
            course["courseTime"]

        self.department_filter_query = f"""(
            department_major=\'{department}\'
            AND yearSemester=\'{semester}\'
        )"""
        for course_info in priority_courses:
            element = {}
            element["day"] = course_info["courseDay"]
            element["time"] = course_info["courseTime"]
            time_off.append(element)

        self.main_query = self.make_main_query(
            self.department_filter_query,
            self.get_abeek_query(department, semester),
            self.get_time_filter(time_off, day_off),
        )
        self.priority_course_query = self.make_priority_course_query(priority_courses)

        cursor.execute(self.main_query)
        self.main_results = cursor.fetchall()

        cursor.execute(self.priority_course_query)
        self.priority_course_results = cursor.fetchall()

    def get_abeek_query(self, department, semester):
        abeek_courses = ""
        if department in self.ABEEK:
            for course in self.ABEEK[department]:
                abeek_courses += f"'{course}', "
        abeek_courses = abeek_courses[:-2]

        abeek_query = f"""(
            yearSemester=\'{semester}\'
            AND courseClassification NOT IN ('전선', '전필', '공필')
            AND courseName IN ({abeek_courses})
        )"""
        return abeek_query

    def get_time_filter(self, time_off, day_off):
        time_filter = """"""
        for idx in range(len(time_off)):
            filter_day = time_off[idx]["day"]
            prefix_time = time_off[idx]["time"].split("-")[0]
            postfix_time = time_off[idx]["time"].split("-")[1]

            time_filter += f"""AND NOT (
            courseDay LIKE \'%{filter_day}%\'
            AND STR_TO_DATE(SUBSTRING_INDEX(courseTime, '-', -1), '%H:%i') > STR_TO_DATE(\'{prefix_time}\', '%H:%i')
            AND STR_TO_DATE(SUBSTRING_INDEX(courseTime, '-', 1), '%H:%i') < STR_TO_DATE(\'{postfix_time}\', '%H:%i')
        )"""

        for idx in range(len(day_off)):
            time_filter += f"""\nAND courseDay NOT Like \'%{day_off[idx]}%\'"""

        return time_filter

    def make_main_query(self, department_filter_query, abeek_query, time_filter):
        query = f"""
        SELECT courseNumber, sectionNumber, courseName, courseClassification, courseDescription, professorName, courseDay, courseTime, credits
        FROM courses
        WHERE
        (
        {abeek_query}
        OR
        {department_filter_query}
        )
        {time_filter}
        """
        return query

    def make_priority_course_query(self, priority_courses) -> str:
        if priority_courses is False:
            return None
        priority_query = """
        SELECT courseNumber, sectionNumber, courseName, courseClassification, courseDescription, professorName, courseDay, courseTime, credits
        FROM courses
        WHERE"""

        for course_info in priority_courses:
            priority_query += f"""
            (
                courseName = \'{course_info['courseName']}\'
                AND courseNumber = \'{course_info['courseNumber']}\'
                AND sectionNumber = \'{course_info['sectionNumber']}\'
                AND professorName = \'{course_info['professorName']}\'
            )
            OR"""
        return priority_query[:-3]

    def get_main_data(self):
        course_result = """"""
        for row in self.main_results:
            course_result += " | ".join(list([str(item) for item in row if itme != "courseClassification"]))
            course_result += "\n"
        return course_result

    def get_priority_data(self):
        priority_result = """"""
        for row in self.priority_course_results:
            priority_result += " | ".join(list([str(item) for item in row]))
            priority_result += "\n"
        return priority_result
