import { Injectable } from '@nestjs/common';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { EntityManager, Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  create(createAuthorInput: CreateAuthorInput) {
    return this.authorRepository.save(createAuthorInput);
  }

  findAll() {
    return this.authorRepository.find();
  }

  findOne(id: number) {
    return this.authorRepository.findOne({ where: { id } });
  }

  update(id: number, updateAuthorInput: UpdateAuthorInput) {
    return this.authorRepository.update(id, updateAuthorInput);
  }

  remove(id: number) {
    return this.authorRepository.delete(id);
  }

  async findOrCreateAuthorsTransactionExecutor(
    authors: CreateAuthorInput[],
    transactionalEntityManager: EntityManager,
  ) {
    let authorsResponse: Author[] = [];
    const authorIds = authors.map((author) => author.id);

    const foundAuthors = await transactionalEntityManager
      .getRepository(Author)
      .createQueryBuilder('author')
      .where('author.id IN (:...authorIds)', { authorIds })
      .getMany();

    if (!foundAuthors?.length) {
      const createdAuthors = this.authorRepository.create(authors);

      authorsResponse = await transactionalEntityManager.save(createdAuthors);

      return authorsResponse;
    } else {
      const authorsToCreate = foundAuthors.reduce((acc, author) => {
        if (!authors.find((a) => a.email === author.email)) {
          acc.push(author);
        }
        return acc;
      }, []);

      if (authorsToCreate.length) {
        authorsResponse =
          await transactionalEntityManager.save(authorsToCreate);

        return authorsResponse;
      }

      return authorsResponse;
    }
  }
}
