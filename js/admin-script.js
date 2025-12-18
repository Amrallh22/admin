import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// إعدادات Firebase (نفس التي استخدمتها في المشروع الأول)
const firebaseConfig = {
    apiKey: "AIzaSyD2h0mXDc9R_PA-KfKTfCi5UnB7J2VBnU4",
    authDomain: "finalproject-ce1dd.firebaseapp.com",
    databaseURL: "https://finalproject-ce1dd-default-rtdb.firebaseio.com",
    projectId: "finalproject-ce1dd",
    storageBucket: "finalproject-ce1dd.firebasestorage.app",
    messagingSenderId: "496077784986",
    appId: "1:496077784986:web:71c5523607ec9694c65c23"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tableBody = document.getElementById('tableBody');

// جلب البيانات وعرضها في الجدول
const usersRef = ref(db, 'users');
onValue(usersRef, (snapshot) => {
    tableBody.innerHTML = ""; // تنظيف الجدول
    const data = snapshot.val();
    
    if (data) {
        for (let id in data) {
            let user = data[id];
            let row = `
                <tr>
                    <td>${user.firstName || '---'}</td>
                    <td>${user.lastName || '---'}</td>
                    <td>${user.email}</td>
                    <td>${user.password}</td>
                    <td><button class="edit-btn" data-id="${id}">تعديل الباسورد</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }

        // إضافة أحداث الضغط لأزرار التعديل
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.getAttribute('data-id');
                editPassword(userId);
            });
        });
    } else {
        tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center'>لا يوجد مستخدمين مسجلين</td></tr>";
    }
});

// وظيفة تعديل كلمة المرور
function editPassword(id) {
    const newPass = prompt("أدخل كلمة المرور الجديدة للمستخدم:");
    if (newPass && newPass.trim() !== "") {
        const userRef = ref(db, 'users/' + id);
        update(userRef, { password: newPass })
            .then(() => alert("تم تحديث كلمة المرور بنجاح في قاعدة البيانات!"))
            .catch(err => alert("حدث خطأ: " + err.message));
    }
}