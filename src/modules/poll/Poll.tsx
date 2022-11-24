import {UserDto} from "../../models/userDto";


interface PollResponse {
    pollId?: number;
    answer: string;
    isCorrect?: boolean | null;

}
interface ResponseOutlet {
    pollId: number;

}
interface PollDto {
    id?: number;
    question: string;
    author: UserDto;
    isQuiz: boolean;
}

interface PollProps {}
export function Poll(props: PollProps) {
    const {} = props;
    return(
        <div>
            Template
        </div>
    );
}
