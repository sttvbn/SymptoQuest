# checker/symptom_checker.py
import json


def __inti__(self, filename):
    self.data = self.load(filename)
    self.question = self.data['questions']
    self.symptom = self.data['symptoms']

def load(filename):
    with open('symptom.json', 'r') as file:
        data = json.load(file)
    return data

def ask_question(questions):
    answers = {}
    for question in questions:
        answer = input(f"{question['question']} (yes/no): ").lower()
        if answer == 'yes':
            answers[question['id']] = True
        elif answer == 'no':
            answers[question['id']] = False
        else:
            print("Invalid! Please answer with only 'yes' or 'no'. ")
            return questions
    return answers
        
def identify_symptom(answer, symptoms):
    possible_symptom = []
    for symptom in symptoms:
        match = True
        for question_id in symptom['question_id']:
            if answer.get(question_id, False) != True:
                match = False
                break
        if match:
            possible_symptom.append(symptom['name'])
    return possible_symptom
    

def main():
    data = load('symptoms.json')
    questions = data['questions']
    symptoms = data['symptoms']

    print("Please answer the following questions for Diagnosis:")
    response = ask_question(questions)
    possible_symptom = identify_symptom(response, symptoms)

    if possible_symptom:
        print("Possbile symptom that you have is: ")
        for symptom in possible_symptom:
            print(f"- {symptom}")
    else:
        print("No matching in the system. Please consult with a professional doctor.")

if __name__ == "__main__":
    main()
