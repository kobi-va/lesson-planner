import { useState, useEffect } from "react";
const Card = ({ children }) => <div className="border p-4 rounded shadow">{children}</div>;
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ children, ...props }) => <button className="bg-blue-500 text-white py-2 px-4 rounded" {...props}>{children}</button>;
const Input = (props) => <input className="border p-2 rounded w-full" {...props} />;
const Textarea = (props) => <textarea className="border p-2 rounded w-full" {...props} />;
import { motion } from "framer-motion";

export default function LessonPlanner() {
  const [ageGroup, setAgeGroup] = useState("");
  const [topic, setTopic] = useState("");
  const [materials, setMaterials] = useState("");
  const [lessonPlan, setLessonPlan] = useState(null);
  const [savedLessons, setSavedLessons] = useState([]);
  const [editLessonId, setEditLessonId] = useState(null);

  useEffect(() => {
    fetchSavedLessons();
  }, []);

  const generateLessonPlan = async () => {
    const response = await fetch("https://hook.us1.make.com/YOUR_MAKE_WEBHOOK_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ageGroup,
        topic,
        materials,
      }),
    });

    const data = await response.json();
    setLessonPlan(data.lessonPlan);
  };

  const saveLesson = async () => {
    const response = await fetch("https://hook.us1.make.com/YOUR_MAKE_WEBHOOK_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ageGroup,
        topic,
        materials,
        lessonPlan,
      }),
    });
    fetchSavedLessons();
  };

  const fetchSavedLessons = async () => {
    const response = await fetch("https://hook.us1.make.com/YOUR_MAKE_WEBHOOK_URL");
    const data = await response.json();
    setSavedLessons(data.lessons);
  };

  const editLesson = async (lesson) => {
    setAgeGroup(lesson.ageGroup);
    setTopic(lesson.topic);
    setMaterials(lesson.materials);
    setLessonPlan(lesson.lessonPlan);
    setEditLessonId(lesson.id);
  };

  const updateLesson = async () => {
    if (!editLessonId) return;
    await fetch("https://hook.us1.make.com/YOUR_MAKE_WEBHOOK_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editLessonId,
        ageGroup,
        topic,
        materials,
        lessonPlan,
      }),
    });
    setEditLessonId(null);
    fetchSavedLessons();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">מתכנן שיעורים חכם</h1>
      <Card className="p-4 max-w-xl mx-auto">
        <CardContent>
          <label className="block text-right font-semibold mb-2">גיל הילדים</label>
          <Input type="text" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} placeholder="לדוגמה: 3-4 שנים" className="text-right" />
          <label className="block text-right font-semibold mt-4 mb-2">נושא השיעור</label>
          <Input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="לדוגמה: חיות בטבע" className="text-right" />
          <label className="block text-right font-semibold mt-4 mb-2">חומרים זמינים</label>
          <Textarea value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="לדוגמה: בובות אצבע, כרטיסיות תמונות" className="text-right" />
          <Button className="mt-4 w-full" onClick={generateLessonPlan}>צור תוכנית שיעור</Button>
          {lessonPlan && (
            <>
              <Button className="mt-2 w-full" onClick={editLessonId ? updateLesson : saveLesson}>{editLessonId ? "עדכן שיעור" : "שמור שיעור"}</Button>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 border rounded bg-gray-100 text-right">
                <h2 className="text-xl font-bold">תוכנית שיעור</h2>
                <p>{lessonPlan}</p>
              </motion.div>
            </>
          )}
        </CardContent>
      </Card>
      <div className="mt-6">
        <h2 className="text-xl font-bold text-right">שיעורים שמורים</h2>
        {savedLessons.map((lesson) => (
          <Card key={lesson.id} className="p-4 mt-2 cursor-pointer" onClick={() => editLesson(lesson)}>
            <CardContent>
              <p className="text-right font-semibold">{lesson.topic}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
