from nameko.rpc import rpc, RpcProxy

class User:
	name = "student"
	
	@rpc

    # Functions of Users Module

    def register(self, user_name, id, password, phone_num, mail_add, is_stu):
        # Register

    def changePassword(self, new_password):
        # Change password
    
    def changePhoneNumber(self, new_phone_number):
        # Change phone number
    
    def changeMailAddress(self, new_mail_address):
        # Change mail address
    


    # Functions of Course Module

    # Teachers
    def addCourse(self, id, course_id):
        # Add course
        print("Course %d was added from your list." % course_id)

    def deleteCourse(self, id, course_id):
        # Delete course
        print("Course %d was removed from your list." % course_id)

    def modifyCourse(self, id, course_id):
        # Modify course information
        print("Course %d was modified from your list." % course_id)

    def searchCourse(self, id, course_id):
        # Search course information
        print("Course %d was Searched from your list." % course_id)
    
    # Students
    def searchAllCourse(self, id, course_id):
        # Search all course information
        print("All course %d was Searched from your list." % course_id)

    def searchCurrentCourse(self, id, course_id):
        # Search current course information
        print("Current course %d was Searched from your list." % course_id)

    def searchFinishedCourse(self, id, course_id):
        # Search finished course information
        print("Finished course %d was Searched from your list." % course_id)

