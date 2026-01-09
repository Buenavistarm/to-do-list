import express from 'express';

const app = express();
app.use(express.json());

const PORT = 3000;

const list = [
     {
          id: 1,
          title: "Assignments",
          status: "pending",
},
{
          id: 2,
          title: "Daily Chores",
          status:"pending"
     }
]

const items = [
     {
          id: 1,
          list_id:1,
          description: "Programming",
          status: "pending"
     },
     {
          id: 2,
          list_id: 1,
          description: "Web dev",
          status: "pending"
     },
     {
          id: 3,
          list_id: 2,
          description: "Wash Dish",
          status: "pending"
     },
     {
          id: 4,
          list_id: 2,
          description: "Clean the room",
          status: "pending"
     }
]


app.get('/get-list', (req, res) => {
    res.status(200).json({ success: true, list });
});

app.post('/add-list', (req, res) => { 
     const { listTitle } = req.body;

     list.push({
          id: list.length + 1,
          title: listTitle,
          status: "pending"
     });

     res.status(200).json({ success: true, list, message: "Title successfully added" });
     message: "Title successfully added"
});

app.get('/edit-list', (req, res) => {
     res.send('2list!');
});

app.get('/delete-list', (req, res) => {
     res.send('3list!');
});


app.get('/get-items/:id', (req, res) => {

     const listId = req.params.id;

     const filtered = items.filter(
          item => item.list_id == listId);

     res.status(200).json({ success: true, items: filtered })
});

app.get('/add-items', (req, res) => {
     res.send('5items!');
});

app.get('/edit-items', (req, res) => {
     res.send('6items!');
});

app.get('/edit-items', (req, res) => {
     res.send('7items!');
});

app.get('/delete-items', (req, res) => {
     res.send('My items!');
});

app.get('/home', (req, res) => {
    res.send('This is homepage');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

