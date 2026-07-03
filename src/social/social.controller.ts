import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/auth-jwt.guard";
import { SocialService } from "./social.service";


@Controller("/social")
@UseGuards(JwtAuthGuard)
export class SocialController {
    constructor(private socialService: SocialService) {}

    @Post("/follow/:id")
    follow(@Param("id") id: string, @Req() req) {
        return this.socialService.follow(req.user.id, id);
    }

    @Delete("/unfollow/:id")
    unfollow(@Param("id") id: string, @Req() req) {
        return this.socialService.unfollow(req.user.id, id);
    }

    @Get("/followers")
    getFollowers(@Query("limit") limit: number, @Query("offset") offset: number, @Req() req) {
        return this.socialService.getFollowers(limit, offset, req.user.id);
    }

    @Get("/following")
    getFollowing(@Query("limit") limit: number, @Query("offset") offset: number, @Req() req) {
        return this.socialService.getFollowing(limit, offset, req.user.id);
    }
}