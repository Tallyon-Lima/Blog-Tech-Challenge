import type { Post } from "@/entities/post.entity.js";
import type { PostRepository } from "@/repositories/post.repository.js";


export class CreatePostUseCase{

    constructor(private postRepository: PostRepository){}

    async handler(post: Post){
        return this.postRepository.create(post)
    }
}