import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth"; //Iska kaam hai check karna ke current request bhejne wala user login hai ya nahi.
import { authOptions } from "@/lib/auth";
// Ismein GitHub authentication ki configuration hai. getServerSession isi configuration ki help se session check karega.


// PUT: Update task title
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const session= await getServerSession(authOptions);  //Yeh NextAuth se current logged-in user ki information leta hai.

     // !session — koi user login nahi hai.
     // !session.user?.email — user ka email available nahi hai.

    if (!session || !session.user?.email){
      return Response.json(
        {error:"please sign in first"},
        {status: 401}
      );
    }

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (
      typeof body.title !== "string" ||
      !body.title.trim()
    ) {
      return Response.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    await client.connect();

    const result = await client
      .db("Task-Manager")
      .collection("tasks")
      .updateOne(
        { _id: new ObjectId(id),
          userEmail: session.user.email,
         },
        { $set: { title: body.title.trim() } }
      );

    if (result.matchedCount === 0) {     //result.matchedCount batata hai ke kitne tasks match hue.
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Task title updated successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// PATCH: Mark task complete or incomplete
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if(!session || !session.user?.email){
      return Response.json(
        {error:"please sign in first"},
        {status: 401}
      );
    }

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (typeof body.completed !== "boolean") {
      return Response.json(
        { error: "Invalid completed value" },
        { status: 400 }
      );
    }

    await client.connect();

    const result = await client
      .db("Task-Manager")
      .collection("tasks")
      .updateOne(
        { _id: new ObjectId(id),
          userEmail: session.user.email,
         },
        { $set: { completed: body.completed } }
      );

    if (result.matchedCount === 0) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Task status updated successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to update task status" },
      { status: 500 }
    );
  }
}

// DELETE: Remove task
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if(!session || !session.user?.email){
    return Response.json(
      {error: "please sign in first"},
      {status:401}
    );
    }

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    await client.connect();

    const result = await client
      .db("Task-Manager")
      .collection("tasks")
      .deleteOne({ _id: new ObjectId(id),
        userEmail: session.user.email,
       });

    if (result.deletedCount === 0) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
